export const dynamic = "force-static";

export async function GET() {
  return Response.json(
    {
      ok: true,
      service: "aloouz-web",
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "cache-control": "no-store, max-age=0",
      },
    },
  );
}
