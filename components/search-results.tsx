"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface SearchResult {
  id: string
  label: string
  description: string
}

interface SearchResultsProps {
  results: SearchResult[]
  onSelect: (result: SearchResult) => void
  selectedId: string | null
}

export default function SearchResults({ results, onSelect, selectedId }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-muted-foreground">No results found. Try a different search term.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <ul className="divide-y">
          {results.map((result) => (
            <li key={result.id} className="p-0">
              <Button
                variant="ghost"
                className={`w-full justify-start text-left rounded-none p-4 h-auto ${
                  selectedId === result.id ? "bg-muted" : ""
                }`}
                onClick={() => onSelect(result)}
              >
                <div>
                  <h3 className="font-medium">{result.label}</h3>
                  {result.description && <p className="text-sm text-muted-foreground truncate">{result.description}</p>}
                  <p className="text-xs text-muted-foreground mt-1">{result.id}</p>
                </div>
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
