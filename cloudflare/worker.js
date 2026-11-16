const ALLOWED_ORIGINS = new Set([
  "https://kingnathz21.github.io"
]);

function response(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    }
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (!ALLOWED_ORIGINS.has(origin)) {
      return new Response("Origin not allowed", { status: 403 });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
          "Vary": "Origin"
        }
      });
    }

    if (request.method !== "GET") {
      return response({ success: false, error: "Method not allowed" }, 405, origin);
    }

    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      try {
        await env.WISHLIST_DB.prepare("SELECT 1 AS ok").first();
        return response({
          success: true,
          service: "Nathan's Wishlist API",
          database: "connected"
        }, 200, origin);
      } catch {
        return response({
          success: false,
          service: "Nathan's Wishlist API",
          database: "unavailable"
        }, 503, origin);
      }
    }

    if (url.pathname === "/api/items") {
      const listType = url.searchParams.get("list");
      if (!["christmas", "main"].includes(listType)) {
        return response({ success: false, error: "Use list=christmas or list=main" }, 400, origin);
      }

      try {
        const { results } = await env.WISHLIST_DB.prepare(`
          SELECT
            id,
            list_type AS listType,
            name,
            wishlist,
            category,
            brand,
            store,
            description,
            notes,
            image,
            link,
            date_added AS dateAdded,
            price,
            quantity,
            priority,
            purchased
          FROM wishlist_items
          WHERE list_type = ?
          ORDER BY purchased ASC, created_at DESC, id DESC
        `).bind(listType).all();

        return response({
          success: true,
          list: listType,
          total: results.length,
          items: results.map(item => ({
            ...item,
            purchased: item.purchased === 1
          }))
        }, 200, origin);
      } catch (error) {
        return response({ success: false, error: "Database query failed" }, 500, origin);
      }
    }

    return response({ success: false, error: "Not found" }, 404, origin);
  }
};
