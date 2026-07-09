import { roaringLibraryInitialize, RoaringBitmap32 } from "roaring-wasm";

// Helper to convert Base64 string to Uint8Array safely
export function base64ToUint8Array(base64Str) {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(base64Str, 'base64'));
  }
  const binary = atob(base64Str);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Binary search to find the correct chunk key in the sorted metadata index
export function findChunkKey(indexMeta, term) {
  if (!indexMeta || indexMeta.length === 0) return null;
  
  let low = 0;
  let high = indexMeta.length - 1;
  let ans = -1;
  
  while (low <= high) {
    const mid = (low + high) >> 1;
    const cmp = indexMeta[mid].startTerm.localeCompare(term);
    
    if (cmp <= 0) {
      ans = mid;
      low = mid + 1; // Look for a larger startTerm that is still <= target term
    } else {
      high = mid - 1;
    }
  }
  
  return ans !== -1 ? indexMeta[ans].chunkKey : null;
}

// Binary search to find the target term inside the terms array of a chunk
export function findTermInChunk(terms, term) {
  if (!terms || terms.length === 0) return null;
  
  let low = 0;
  let high = terms.length - 1;
  
  while (low <= high) {
    const mid = (low + high) >> 1;
    const midTerm = terms[mid].term;
    const cmp = midTerm.localeCompare(term);
    
    if (cmp === 0) {
      return terms[mid];
    } else if (cmp < 0) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  
  return null;
}

// Fetch chunk and retrieve term bitmap
async function getTermBitmap(kvNamespace, indexMeta, term) {
  const chunkKey = findChunkKey(indexMeta, term);
  if (!chunkKey) return null;
  
  const chunkDataStr = await kvNamespace.get(chunkKey);
  if (!chunkDataStr) return null;
  
  const chunk = JSON.parse(chunkDataStr);
  const entry = findTermInChunk(chunk.terms, term);
  if (!entry) return null;
  
  const buffer = base64ToUint8Array(entry.bitmap);
  const bitmap = new RoaringBitmap32();
  bitmap.deserialize(buffer, "portable");
  return bitmap;
}

export class QueryBuilder {
  constructor(kvNamespace, indexMetaPromise) {
    this.kvNamespace = kvNamespace;
    this.indexMetaPromise = indexMetaPromise;
    this.steps = [];
    this.currentField = null;
    this.nextOp = null; // 'and' | 'or' | 'not'
  }

  where(field) {
    this.currentField = field;
    return this;
  }

  equals(value) {
    if (!this.currentField) {
      throw new Error("QueryBuilder Error: must call where() before equals()");
    }
    this.steps.push({
      type: 'condition',
      field: this.currentField,
      value: value,
      op: this.nextOp || 'init'
    });
    this.currentField = null;
    this.nextOp = null;
    return this;
  }

  and() {
    this.nextOp = 'and';
    return this;
  }

  or() {
    this.nextOp = 'or';
    return this;
  }

  not() {
    this.nextOp = 'not';
    return this;
  }

  async run() {
    // 1. Initialize roaring-wasm
    await roaringLibraryInitialize();

    // 2. Wait for metadata to resolve
    const indexMeta = await this.indexMetaPromise;

    let resultBitmap = null;

    for (const step of this.steps) {
      if (step.type === 'condition') {
        const term = `${step.field}:${step.value}`;
        const termBitmap = await getTermBitmap(this.kvNamespace, indexMeta, term);
        
        if (!resultBitmap) {
          // First step: initialize results bitmap
          resultBitmap = termBitmap ? termBitmap : new RoaringBitmap32();
        } else {
          if (step.op === 'and') {
            if (termBitmap) {
              resultBitmap.andInPlace(termBitmap);
            } else {
              resultBitmap.clear(); // Intersecting with empty results in empty
            }
          } else if (step.op === 'or') {
            if (termBitmap) {
              resultBitmap.orInPlace(termBitmap);
            }
          } else if (step.op === 'not') {
            if (termBitmap) {
              resultBitmap.andNotInPlace(termBitmap); // A AND NOT B
            }
          }
        }
      }
    }

    if (!resultBitmap || resultBitmap.isEmpty) {
      return [];
    }

    // 3. Resolve resulting movie IDs to complete objects
    const movieIds = resultBitmap.toArray();
    const movies = [];
    for (const id of movieIds) {
      const movieDataStr = await this.kvNamespace.get(`movie:${id}`);
      if (movieDataStr) {
        movies.push(JSON.parse(movieDataStr));
      }
    }

    return movies;
  }
}

export class MovieSearchClient {
  constructor(kvNamespace) {
    if (!kvNamespace) {
      throw new Error("MovieSearchClient Error: KV namespace must be provided");
    }
    this.kvNamespace = kvNamespace;
    this.indexMetaPromise = null;
  }

  _loadIndexMeta() {
    if (!this.indexMetaPromise) {
      this.indexMetaPromise = this.kvNamespace.get("index:meta").then(metaStr => {
        return metaStr ? JSON.parse(metaStr) : [];
      });
    }
    return this.indexMetaPromise;
  }

  query() {
    return new QueryBuilder(this.kvNamespace, this._loadIndexMeta());
  }
}
