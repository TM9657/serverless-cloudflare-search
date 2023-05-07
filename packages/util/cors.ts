import config from "../../config.json";
const allowedOrigins = new Set(config.cors);

export class CorsResponse {
  body: BodyInit | null;
  status: number;
  constructor(body: BodyInit | null, status = 200) {
    this.status = status;
    this.body = body;
  }

  finalize(request: Request): Response {
    let origin = "";
    if (
      request.headers.has("Origin") &&
      allowedOrigins.has(request.headers.get("Origin") || "")
    )
      origin = request.headers.get("Origin") || "";
    const headers: HeadersInit = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Requested-With",
      "Content-Type": "application/json",
      "X-DNS-Prefetch-Control": "off",
      "X-Frame-Options": "DENY",
      "Cache-Control": "no-store",
      "Content-Security-Policy": "frame-ancestors 'none'",
      "x-provided-by": "serverless-cloudflare-search@tm9657.de",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: headers,
      });
    }

    const response = new Response(this.body, {
      status: this.status,
      headers: headers,
    });
    return response;
  }
}
