import { MovieSearchClient } from "./query-builder.js";

export { MovieSearchClient };

export default {
  /**
   * Example Cloudflare Worker Fetch Handler
   * Exposes a search API over HTTP.
   * 
   * Expects a KV namespace binding named `MOVIES_KV`.
   * Try querying: /search?category=Action or /search?category=Sci-Fi&and=Drama
   */
  async fetch(request, env, ctx) {
    if (!env || !env.MOVIES_KV) {
      return new Response(
        JSON.stringify({ error: "KV namespace binding MOVIES_KV is missing" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const url = new URL(request.url);
    if (url.pathname !== "/search") {
      return new Response("Not Found. Use /search", { status: 404 });
    }

    const category = url.searchParams.get("category");
    const andCategory = url.searchParams.get("and");
    const orCategory = url.searchParams.get("or");
    const notCategory = url.searchParams.get("not");

    if (!category) {
      return new Response(
        JSON.stringify({ error: "Missing required query parameter: 'category'" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    try {
      const client = new MovieSearchClient(env.MOVIES_KV);
      const query = client.query().where("category").equals(category);

      if (andCategory) {
        query.and().where("category").equals(andCategory);
      } else if (orCategory) {
        query.or().where("category").equals(orCategory);
      } else if (notCategory) {
        query.not().where("category").equals(notCategory);
      }

      const results = await query.run();

      return new Response(JSON.stringify({ results }, null, 2), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message, stack: err.stack }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
};
