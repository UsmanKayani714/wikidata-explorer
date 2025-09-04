import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");

	if (!id) {
		return NextResponse.json(
			{ error: "Entity ID is required" },
			{ status: 400 }
		);
	}

	try {
		// Fetch entity data from Wikidata
		const url = `https://www.wikidata.org/wiki/Special:EntityData/${id}.json`;
		const response = await fetch(url);
		const data = await response.json();

		const entity = data.entities[id];

		if (!entity) {
			return NextResponse.json({ error: "Entity not found" }, { status: 404 });
		}

		// Process and organize the entity data
		const processedData = {
			labels: processLabels(entity.labels || {}),
			descriptions: processLabels(entity.descriptions || {}),
			aliases: processAliases(entity.aliases || {}),
			sitelinks: processSitelinks(entity.sitelinks || {}),
			claims: entity.claims || {},
			properties: processProperties(entity.claims || {}),
		};

		return NextResponse.json(processedData);
	} catch (error) {
		console.error("Error fetching entity data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch entity data" },
			{ status: 500 }
		);
	}
}

// Process labels and descriptions to ensure they're strings
function processLabels(items: Record<string, any>) {
	const result: Record<string, string> = {};

	for (const [lang, item] of Object.entries(items)) {
		if (typeof item === "string") {
			result[lang] = item;
		} else if (item && typeof item === "object") {
			result[lang] = item.value || item.text || JSON.stringify(item);
		} else {
			result[lang] = String(item);
		}
	}

	return result;
}

// Process aliases to a more usable format
function processAliases(aliases: Record<string, any[]>) {
	const result: Record<string, string[]> = {};

	for (const [lang, aliasList] of Object.entries(aliases)) {
		if (!Array.isArray(aliasList)) {
			result[lang] = [String(aliasList)];
			continue;
		}

		result[lang] = aliasList.map((item) => {
			if (typeof item === "string") return item;
			if (item && typeof item === "object") {
				if (item.value) return item.value;
				if (item.text) return item.text;
			}
			return String(item);
		});
	}

	return result;
}

// Process sitelinks to include URLs
function processSitelinks(sitelinks: Record<string, any>) {
	const result: Record<string, { site: string; title: string; url: string }> =
		{};

	for (const [site, data] of Object.entries(sitelinks)) {
		const title = data.title;
		let url = data.url;

		if (!url) {
			// Construct URL if not provided
			const domain = site.replace("wiki", "wikipedia.org/wiki/");
			url = `https://${domain}/${encodeURIComponent(title.replace(/ /g, "_"))}`;
		}

		result[site] = {
			site,
			title,
			url,
		};
	}

	return result;
}

// Process and categorize properties
function processProperties(claims: Record<string, any[]>) {
	const basic: any[] = [];
	const identifiers: any[] = [];
	const statements: any[] = [];

	// Property labels (simplified for this example)
	const propertyLabels: Record<string, string> = {
		P31: "Instance of",
		P21: "Sex or gender",
		P27: "Country of citizenship",
		P106: "Occupation",
		P569: "Date of birth",
		P570: "Date of death",
		P19: "Place of birth",
		P20: "Place of death",
		P214: "VIAF ID",
		P227: "GND ID",
		P213: "ISNI",
		P646: "Freebase ID",
		P18: "Image",
		P856: "Official website",
		P1082: "Population",
		P17: "Country",
		P131: "Located in",
		P625: "Coordinate location",
		P41: "Flag",
		P373: "Commons category",
		P1566: "GeoNames ID",
		P281: "Postal code",
		P2046: "Area",
		P30: "Continent",
		P6: "Head of government",
		P35: "Head of state",
		P37: "Official language",
		P38: "Currency",
		P47: "Shares border with",
		P36: "Capital",
		P1448: "Official name",
		P571: "Inception",
		P576: "Dissolution",
		P580: "Start time",
		P582: "End time",
		P2048: "Height",
		P2049: "Width",
		P2067: "Mass",
		P577: "Publication date",
		P50: "Author",
		P57: "Director",
		P58: "Screenwriter",
		P161: "Cast member",
		P170: "Creator",
		P175: "Performer",
		P495: "Country of origin",
		P136: "Genre",
		P144: "Based on",
		P166: "Award received",
		P276: "Location",
		P361: "Part of",
		P463: "Member of",
		P527: "Has part",
		P737: "Influenced by",
		P800: "Notable work",
		P1343: "Described by source",
		P1559: "Name in native language",
		P2561: "Name",
		P2572: "Twitter username",
		P2671: "Google Knowledge Graph ID",
		P3417: "Quora topic ID",
		P3984: "Subreddit",
		P4264: "LinkedIn company ID",
	};

	for (const [propertyId, claimsList] of Object.entries(claims)) {
		const propertyLabel = propertyLabels[propertyId] || propertyId;

		// Process each claim for this property
		for (const claim of claimsList) {
			const mainSnak = claim.mainsnak;

			if (!mainSnak || mainSnak.snaktype === "novalue") {
				continue;
			}

			const value = extractSnakValue(mainSnak);

			const processedClaim = {
				id: propertyId,
				label: propertyLabel,
				value,
			};

			// Categorize properties
			if (propertyId.startsWith("P") && mainSnak.datatype === "external-id") {
				identifiers.push(processedClaim);
			} else if (
				[
					"P31",
					"P21",
					"P27",
					"P106",
					"P569",
					"P570",
					"P19",
					"P20",
					"P18",
					"P856",
					"P1082",
					"P17",
					"P131",
					"P625",
					"P41",
					"P373",
					"P1566",
					"P281",
					"P2046",
					"P30",
					"P6",
					"P35",
					"P37",
					"P38",
					"P47",
					"P36",
					"P1448",
					"P571",
					"P576",
					"P580",
					"P582",
					"P2048",
					"P2049",
					"P2067",
					"P577",
					"P50",
					"P57",
					"P58",
					"P161",
					"P170",
					"P175",
					"P495",
					"P136",
					"P144",
					"P166",
					"P276",
					"P361",
					"P463",
					"P527",
					"P737",
					"P800",
					"P1343",
					"P1559",
					"P2561",
				].includes(propertyId)
			) {
				basic.push(processedClaim);
			} else {
				statements.push(processedClaim);
			}
		}
	}

	return {
		basic,
		identifiers,
		statements,
	};
}

// Extract value from a snak
function extractSnakValue(snak: any) {
	if (!snak || !snak.datavalue) {
		return null;
	}

	const { datatype, datavalue } = snak;

	switch (datatype) {
		case "wikibase-item":
			return {
				type: "wikibase-entityid",
				id: datavalue.value.id,
				label: datavalue.value.id, // Ideally, we would fetch the label
			};

		case "string":
			return datavalue.value;

		case "monolingualtext":
			return {
				type: "monolingualtext",
				text: datavalue.value.text,
				language: datavalue.value.language,
			};

		case "wikibase-lexeme":
		case "wikibase-form":
		case "wikibase-sense":
			return {
				type: datatype,
				id: datavalue.value.id,
				label: datavalue.value.id,
			};

		case "time":
			const timeValue = datavalue.value;
			// Format the time value
			let formatted = timeValue.time;
			try {
				// Remove the + and precision handling
				const dateStr = timeValue.time.replace(/^\+/, "");
				const date = new Date(dateStr);

				// Format based on precision
				if (timeValue.precision >= 11) {
					// Day precision or better
					formatted = date.toLocaleDateString();
				} else if (timeValue.precision === 10) {
					// Month precision
					formatted = date.toLocaleDateString(undefined, {
						year: "numeric",
						month: "long",
					});
				} else if (timeValue.precision === 9) {
					// Year precision
					formatted = date.getFullYear().toString();
				} else if (timeValue.precision === 8) {
					// Decade precision
					const decade = Math.floor(date.getFullYear() / 10) * 10;
					formatted = `${decade}s`;
				} else if (timeValue.precision === 7) {
					// Century precision
					const century = Math.floor(date.getFullYear() / 100) + 1;
					formatted = `${century}${getOrdinalSuffix(century)} century`;
				}
			} catch (e) {
				// Fallback to original format
			}

			return {
				type: "time",
				time: timeValue.time,
				formatted,
			};

		case "quantity":
			return {
				type: "quantity",
				amount: datavalue.value.amount,
				unit: datavalue.value.unit,
				formatted: `${datavalue.value.amount} ${datavalue.value.unit.replace(
					"http://www.wikidata.org/entity/",
					""
				)}`,
			};

		case "globe-coordinate":
			return {
				type: "globe-coordinate",
				latitude: datavalue.value.latitude,
				longitude: datavalue.value.longitude,
				formatted: `${datavalue.value.latitude}, ${datavalue.value.longitude}`,
			};

		case "url":
			return datavalue.value;

		default:
			// Ensure we're not returning raw objects
			if (typeof datavalue.value === "object") {
				return JSON.stringify(datavalue.value);
			}
			return datavalue.value;
	}
}

// Helper function for ordinal suffixes
function getOrdinalSuffix(n: number): string {
	const s = ["th", "st", "nd", "rd"];
	const v = n % 100;
	return s[(v - 20) % 10] || s[v] || s[0];
}
