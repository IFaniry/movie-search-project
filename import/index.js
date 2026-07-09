import { roaringLibraryInitialize, RoaringBitmap32 } from "roaring-wasm";

// Helper to convert Uint8Array to Base64 string safely
export function uint8ArrayToBase64(arr) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(arr).toString('base64');
  }
  let binary = '';
  const len = arr.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(arr[i]);
  }
  return btoa(binary);
}

/**
 * Imports generic data, builds the inverted index using roaring bitmaps, chunks it,
 * and stores it on Cloudflare KV.
 * 
 * @param {Array<string>} data Array of stringified JSON objects
 * @param {Object} kvNamespace Mock or real Cloudflare KV namespace object
 * @param {Object} options Configuration options
 * @param {number} options.maxChunkSize Maximum size of each chunk in bytes (JSON serialized)
 * @param {string} options.keyPrefix Prefix for storing items in KV (defaults to "item")
 */
export async function importData(data, kvNamespace, options = {}) {
  const maxChunkSize = options.maxChunkSize || 25 * 1024 * 1024; // Default to 25 MiB KV limit
  const keyPrefix = options.keyPrefix || "item";
  
  // 1. Initialize roaring-wasm
  await roaringLibraryInitialize();

  // 2. Build inverted index mappings (term -> RoaringBitmap32)
  const termBitmaps = {};
  for (const itemStr of data) {
    const item = JSON.parse(itemStr);
    if (!item.id) {
      throw new Error(`Invalid item format, missing id: ${itemStr}`);
    }
    
    // Store the item itself in KV for metadata retrieval
    await kvNamespace.put(`${keyPrefix}:${item.id}`, itemStr);

    for (const [key, value] of Object.entries(item)) {
      if (key === 'id') continue;
      
      const values = Array.isArray(value) ? value : [value];
      for (const val of values) {
        if (val === null || val === undefined) continue;
        const term = `${key}:${val}`;
        if (!termBitmaps[term]) {
          termBitmaps[term] = new RoaringBitmap32();
        }
        termBitmaps[term].add(item.id);
      }
    }
  }

  // 3. Serialize and prepare terms sorted alphabetically
  const sortedTerms = Object.keys(termBitmaps).sort();
  const entries = [];
  for (const term of sortedTerms) {
    const bitmap = termBitmaps[term];
    bitmap.optimize(); // Optimize compression
    const serialized = bitmap.serialize("portable");
    const base64Bitmap = uint8ArrayToBase64(serialized);
    
    entries.push({
      term,
      bitmap: base64Bitmap
    });
  }

  // 4. Chunk the entries to respect Cloudflare KV limits
  const chunks = [];
  const indexMeta = [];
  let currentChunkTerms = [];
  let currentChunkSize = 0;
  let chunkIndex = 0;

  for (const entry of entries) {
    const entrySize = JSON.stringify(entry).length;
    
    // If the chunk size would exceed maxChunkSize by adding this entry, flush current chunk
    if (currentChunkTerms.length > 0 && currentChunkSize + entrySize > maxChunkSize) {
      const chunkKey = `index:chunk:${chunkIndex++}`;
      chunks.push({ key: chunkKey, data: { terms: currentChunkTerms } });
      indexMeta.push({ startTerm: currentChunkTerms[0].term, chunkKey });
      
      currentChunkTerms = [];
      currentChunkSize = 0;
    }
    
    currentChunkTerms.push(entry);
    currentChunkSize += entrySize;
  }

  // Flush the final chunk
  if (currentChunkTerms.length > 0) {
    const chunkKey = `index:chunk:${chunkIndex++}`;
    chunks.push({ key: chunkKey, data: { terms: currentChunkTerms } });
    indexMeta.push({ startTerm: currentChunkTerms[0].term, chunkKey });
  }

  // 5. Write index chunks to KV
  for (const chunk of chunks) {
    await kvNamespace.put(chunk.key, JSON.stringify(chunk.data));
  }

  // 6. Write index metadata to KV
  await kvNamespace.put("index:meta", JSON.stringify(indexMeta));

  return {
    itemCount: data.length,
    termCount: sortedTerms.length,
    chunkCount: chunks.length,
    indexMeta
  };
}
