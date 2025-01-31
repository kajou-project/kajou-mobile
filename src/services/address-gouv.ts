const URL_BASE = "https://api-adresse.data.gouv.fr/search/";

export async function searchAddress(query: string): Promise<string[]> {
  if (query.length < 3) {
    return [];
  }

  const response = await fetch(`${URL_BASE}?q=${query}&limit=5&type=housenumber&autocomplete=1`);
  const data = await response.json();

  return data.features.map((feature: any) => feature.properties.label);
}
