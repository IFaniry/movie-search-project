import { importData } from "./import/index.js";
import { MovieSearchClient, findChunkKey, findTermInChunk } from "./client/query-builder.js";

// 1. Mock Cloudflare KV Namespace
class MockKV {
  constructor() {
    this.store = new Map();
  }

  async put(key, value) {
    this.store.set(key, String(value));
  }

  async get(key) {
    return this.store.get(key) || null;
  }

  async delete(key) {
    this.store.delete(key);
  }
}

// Helper to format output lists
const formatMoviesList = (movies) => {
  return movies.map(m => `#${m.id}: ${m.title} [${m.category.join(", ")}]`).join(" | ");
};

async function runTests() {
  console.log("=== STARTING MOVIE SEARCH SYSTEM TESTS ===");

  const kv = new MockKV();

  // 2. Define the sample 3 movies as requested
  const movies = [
    { id: 1, title: "Inception", category: ["Sci-Fi", "Action", "Thriller"] },
    { id: 2, title: "The Dark Knight", category: ["Action", "Crime", "Drama"] },
    { id: 3, title: "Interstellar", category: ["Sci-Fi", "Drama", "Adventure"] }
  ];

  console.log("\n--- Sample Movies to Import ---");
  movies.forEach(m => console.log(`Movie ${m.id}: "${m.title}" Categories: ${JSON.stringify(m.category)}`));

  // 3. Import movies with a very small maxChunkSize to force chunking
  // Each category term looks like `category:<Name>` and mapping to base64.
  // With 3 movies we have categories: Action, Adventure, Crime, Drama, Sci-Fi, Thriller.
  // We set maxChunkSize = 130 bytes to ensure chunking splits these terms.
  console.log("\n--- Importing movies with chunking limit: 130 bytes ---");
  const stringifiedMovies = movies.map(m => JSON.stringify(m));
  const importResult = await importData(stringifiedMovies, kv, { maxChunkSize: 130, keyPrefix: "movie" });
  console.log("Import Result:", JSON.stringify(importResult, null, 2));

  // Verify stored keys in the KV Store
  console.log("\n--- Keys stored in Mock KV ---");
  for (const [key, value] of kv.store.entries()) {
    if (key.startsWith("index:")) {
      console.log(`Key: "${key}" -> Size: ${value.length} bytes -> Preview: ${value.substring(0, 100)}...`);
    } else {
      console.log(`Key: "${key}" -> Preview: ${value}`);
    }
  }

  // 4. Initialize MovieSearchClient
  const client = new MovieSearchClient(kv);

  // Helper to run query and check accuracy
  const testQuery = async (description, buildFn, expectedIds) => {
    console.log(`\nTesting Query: ${description}`);
    const builder = client.query();
    buildFn(builder);
    
    const results = await builder.run();
    const resultIds = results.map(m => m.id).sort((a, b) => a - b);
    const expectedSorted = expectedIds.sort((a, b) => a - b);
    
    console.log(`Results: [${formatMoviesList(results)}]`);
    
    const success = JSON.stringify(resultIds) === JSON.stringify(expectedSorted);
    if (success) {
      console.log("✅ SUCCESS");
    } else {
      console.log(`❌ FAILURE. Expected IDs: ${JSON.stringify(expectedSorted)}, got: ${JSON.stringify(resultIds)}`);
      process.exit(1);
    }
  };

  // 5. Run standard search scenarios
  
  // Scenario A: Single category search (Action)
  // Expected: Inception (1), The Dark Knight (2)
  await testQuery(
    "category = 'Action'",
    q => q.where("category").equals("Action"),
    [1, 2]
  );

  // Scenario B: Single category search (Sci-Fi)
  // Expected: Inception (1), Interstellar (3)
  await testQuery(
    "category = 'Sci-Fi'",
    q => q.where("category").equals("Sci-Fi"),
    [1, 3]
  );

  // Scenario C: AND search (Action AND Sci-Fi)
  // Expected: Inception (1)
  await testQuery(
    "category = 'Action' AND category = 'Sci-Fi'",
    q => q.where("category").equals("Action").and().where("category").equals("Sci-Fi"),
    [1]
  );

  // Scenario D: OR search (Action OR Drama)
  // Expected: Inception (1), The Dark Knight (2), Interstellar (3)
  await testQuery(
    "category = 'Action' OR category = 'Drama'",
    q => q.where("category").equals("Action").or().where("category").equals("Drama"),
    [1, 2, 3]
  );

  // Scenario E: NOT search (Action NOT Drama)
  // Expected: Inception (1) (since Dark Knight has Drama)
  await testQuery(
    "category = 'Action' NOT category = 'Drama'",
    q => q.where("category").equals("Action").not().where("category").equals("Drama"),
    [1]
  );

  // Scenario F: Term does not exist (Romance)
  // Expected: []
  await testQuery(
    "category = 'Romance' (does not exist)",
    q => q.where("category").equals("Romance"),
    []
  );

  console.log("\n=== ALL TESTS PASSED SUCCESSFULLY! ===");
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
