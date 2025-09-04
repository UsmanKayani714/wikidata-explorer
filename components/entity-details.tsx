import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface EntityDetailsProps {
	entity: {
		id: string;
		label: string;
		description: string;
	};
	details: {
		claims: Record<string, any[]>;
		labels: Record<string, any>;
		descriptions: Record<string, any>;
		aliases: Record<string, any>;
		sitelinks: Record<string, { site: string; title: string; url: string }>;
		properties: {
			basic: Array<{ id: string; label: string; value: any }>;
			identifiers: Array<{ id: string; label: string; value: any }>;
			statements: Array<{ id: string; label: string; value: any }>;
		};
	} | null;
}

export default function EntityDetails({ entity, details }: EntityDetailsProps) {
	if (!entity) {
		return null;
	}

	return (
		<Card>
			<CardHeader className="pb-2">
				<div className="flex justify-between items-start">
					<div>
						<CardTitle className="text-2xl">{entity.label}</CardTitle>
						{entity.description && (
							<p className="text-muted-foreground mt-1">{entity.description}</p>
						)}
					</div>
					<Badge variant="outline" className="ml-2">
						{entity.id}
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				{!details ? (
					<p className="text-muted-foreground">
						No details available for this entity.
					</p>
				) : (
					<Tabs defaultValue="properties">
						<TabsList className="mb-4">
							<TabsTrigger value="properties">Properties</TabsTrigger>
							<TabsTrigger value="identifiers">Identifiers</TabsTrigger>
							<TabsTrigger value="links">Links</TabsTrigger>
							<TabsTrigger value="languages">Languages</TabsTrigger>
						</TabsList>

						<TabsContent value="properties" className="space-y-4">
							{details.properties?.basic?.length > 0 ? (
								details.properties.basic.map((prop, index) => (
									<PropertyItem key={`${prop.id}-${index}`} property={prop} />
								))
							) : (
								<p className="text-muted-foreground">
									No basic properties available.
								</p>
							)}
						</TabsContent>

						<TabsContent value="identifiers" className="space-y-4">
							{details.properties?.identifiers?.length > 0 ? (
								details.properties.identifiers.map((prop, index) => (
									<PropertyItem key={`${prop.id}-${index}`} property={prop} />
								))
							) : (
								<p className="text-muted-foreground">
									No identifiers available.
								</p>
							)}
						</TabsContent>

						<TabsContent value="links" className="space-y-4">
							{details.sitelinks &&
							Object.keys(details.sitelinks).length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
									{Object.entries(details.sitelinks).map(([key, link]) => (
										<a
											key={key}
											href={link.url}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center p-2 hover:bg-muted rounded"
										>
											<span className="flex-1">
												{link.site}: {link.title}
											</span>
											<ExternalLink className="h-4 w-4 ml-2" />
										</a>
									))}
								</div>
							) : (
								<p className="text-muted-foreground">No links available.</p>
							)}
						</TabsContent>

						<TabsContent value="languages" className="space-y-4">
							<div className="space-y-4">
								<div>
									<h3 className="font-medium mb-2">Labels</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
										{details.labels &&
											Object.entries(details.labels).map(([lang, label]) => (
												<div key={lang} className="flex">
													<Badge variant="outline" className="mr-2">
														{lang}
													</Badge>
													<span>
														{typeof label === "object" && label.value
															? label.value
															: label}
													</span>
												</div>
											))}
									</div>
								</div>

								<div>
									<h3 className="font-medium mb-2">Descriptions</h3>
									<div className="grid grid-cols-1 gap-2">
										{details.descriptions &&
											Object.entries(details.descriptions).map(
												([lang, desc]) => (
													<div key={lang} className="flex">
														<Badge variant="outline" className="mr-2">
															{lang}
														</Badge>
														<span>
															{typeof desc === "object" && desc.value
																? desc.value
																: desc}
														</span>
													</div>
												)
											)}
									</div>
								</div>

								<div>
									<h3 className="font-medium mb-2">Aliases</h3>
									<div className="grid grid-cols-1 gap-2">
										{details.aliases &&
											Object.entries(details.aliases).map(([lang, aliases]) => (
												<div key={lang} className="flex">
													<Badge variant="outline" className="mr-2">
														{lang}
													</Badge>
													<span>
														{Array.isArray(aliases)
															? aliases
																	.map((alias) =>
																		typeof alias === "object" && alias.value
																			? alias.value
																			: alias
																	)
																	.join(", ")
															: aliases}
													</span>
												</div>
											))}
									</div>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				)}
			</CardContent>
		</Card>
	);
}

function PropertyItem({ property }: { property: any }) {
	const renderValue = (value: any) => {
		if (typeof value === "string") {
			// Check if it's a URL
			if (value.startsWith("http")) {
				return (
					<a
						href={value}
						target="_blank"
						rel="noopener noreferrer"
						className="text-primary hover:underline flex items-center"
					>
						{value}
						<ExternalLink className="h-3 w-3 ml-1" />
					</a>
				);
			}
			return value;
		}

		if (Array.isArray(value)) {
			return (
				<ul className="list-disc pl-5">
					{value.map((item, index) => (
						<li key={index}>{renderValue(item)}</li>
					))}
				</ul>
			);
		}

		if (value && typeof value === "object") {
			if (value.type === "time") {
				return value.formatted || value.time;
			}

			if (value.type === "monolingualtext") {
				return `${value.text} (${value.language})`;
			}

			if (value.type === "wikibase-entityid") {
				return (
					<span>
						{value.label || value.id}
						{value.description && (
							<span className="text-muted-foreground ml-2">
								({value.description})
							</span>
						)}
					</span>
				);
			}

			// Handle objects with language and value properties (multilingual text)
			if (value.language && value.value) {
				return `${value.value} (${value.language})`;
			}

			return JSON.stringify(value);
		}

		return String(value);
	};

	return (
		<div className="border rounded-md p-3">
			<h3 className="font-medium flex items-center">
				<span>{property.label}</span>
				{property.id && (
					<Badge variant="outline" className="ml-2 text-xs">
						{property.id}
					</Badge>
				)}
			</h3>
			<div className="mt-1">{renderValue(property.value)}</div>
		</div>
	);
}
