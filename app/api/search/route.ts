import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  try {
    // Wikidata API search endpoint
    const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(query)}&language=en&format=json&origin=*&limit=10`

    const response = await fetch(url)
    const data = await response.json()

    // Transform the response to a more usable format
    const results = data.search.map((item: any) => ({
      id: item.id,
      label: item.label || item.id,
      description: item.description || "",
      url: item.concepturi || "",
    }))

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Error searching Wikidata:", error)
    return NextResponse.json({ error: "Failed to search Wikidata" }, { status: 500 })
  }
}
