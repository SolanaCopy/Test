// src/app/api/pyth-latest/route.js

export async function GET(request) {
  // Feed-ID voor BTC/USD (controleer of dit de juiste feed-ID is)
  const BTC_FEED_ID =
    "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43";

  // Stel de URL samen voor de Hermes API endpoint
  const url = `https://hermes.pyth.network/api/latest_price_feeds?ids[]=${BTC_FEED_ID}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch price from Pyth API" }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error fetching BTC price:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
