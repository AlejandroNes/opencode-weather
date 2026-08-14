import { GEOCODING_URL } from "../utils/constants.ts";
import type { City } from "../types/City.ts";

type GeocodingResponse = {
  results?: Array<{
    name?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  }>;
};

export async function findCity(cityName: string): Promise<City | null> {
  const params = new URLSearchParams({ name: cityName, count: "1", language: "es", format: "json" });
  const response = await fetch(`${GEOCODING_URL}?${params}`);
  if (!response.ok) throw new Error(`Geocoding API respondió con HTTP ${response.status}.`);

  const data = await response.json() as GeocodingResponse;
  const result = data.results?.[0];
  if (!result || typeof result.name !== "string" || typeof result.country !== "string" ||
    typeof result.latitude !== "number" || typeof result.longitude !== "number") {
    return null;
  }

  return { name: result.name, country: result.country, latitude: result.latitude, longitude: result.longitude };
}
