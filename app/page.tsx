"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import SearchResults from "@/components/search-results";
import EntityDetails from "@/components/entity-details";
import { useDebounce } from "@/hooks/use-debounce";

export default function WikidataExplorer() {
	const [searchTerm, setSearchTerm] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const [searchResults, setSearchResults] = useState([]);
	const [selectedEntity, setSelectedEntity] = useState(null);
	const [entityDetails, setEntityDetails] = useState(null);
	const [isLoadingDetails, setIsLoadingDetails] = useState(false);

	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	// Search for entities when the debounced search term changes
	useEffect(() => {
		const searchEntities = async () => {
			if (debouncedSearchTerm.length < 2) {
				setSearchResults([]);
				return;
			}

			setIsSearching(true);
			try {
				const response = await fetch(
					`/api/search?q=${encodeURIComponent(debouncedSearchTerm)}`
				);
				const data = await response.json();
				setSearchResults(data.results || []);
			} catch (error) {
				console.error("Error searching entities:", error);
				setSearchResults([]);
			} finally {
				setIsSearching(false);
			}
		};

		searchEntities();
	}, [debouncedSearchTerm]);

	// Fetch entity details when an entity is selected
	const handleEntitySelect = async (entity) => {
		setSelectedEntity(entity);
		setIsLoadingDetails(true);

		try {
			const response = await fetch(
				`/api/entity?id=${encodeURIComponent(entity.id)}`
			);
			const data = await response.json();
			setEntityDetails(data);
		} catch (error) {
			console.error("Error fetching entity details:", error);
			setEntityDetails(null);
		} finally {
			setIsLoadingDetails(false);
		}
	};

	return (
		<main className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-center mb-8">Wikidata Explorer</h1>

			<div className="max-w-3xl mx-auto mb-8">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
					<Input
						type="text"
						placeholder="Search Wikidata (e.g., 'Berlin', 'Einstein', 'Mona Lisa')"
						className="pl-10"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="md:col-span-1">
					{isSearching ? (
						<Card>
							<CardContent className="p-4">
								<div className="space-y-2">
									{Array(5)
										.fill(0)
										.map((_, i) => (
											<Skeleton key={i} className="h-12 w-full" />
										))}
								</div>
							</CardContent>
						</Card>
					) : (
						<SearchResults
							results={searchResults}
							onSelect={handleEntitySelect}
							selectedId={selectedEntity?.id}
						/>
					)}
				</div>

				<div className="md:col-span-2">
					{isLoadingDetails ? (
						<Card>
							<CardContent className="p-6">
								<Skeleton className="h-8 w-3/4 mb-4" />
								<div className="space-y-4">
									{Array(8)
										.fill(0)
										.map((_, i) => (
											<div key={i} className="space-y-2">
												<Skeleton className="h-5 w-1/4" />
												<Skeleton className="h-16 w-full" />
											</div>
										))}
								</div>
							</CardContent>
						</Card>
					) : selectedEntity ? (
						<EntityDetails entity={selectedEntity} details={entityDetails} />
					) : (
						<Card>
							<CardContent className="p-6 text-center">
								<h3 className="text-xl font-medium text-muted-foreground mb-2">
									No Entity Selected
								</h3>
								<p className="text-muted-foreground">
									Search for a Wikidata entity and select it from the results to
									view its details.
								</p>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</main>
	);
}
