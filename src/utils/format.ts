import type { City } from "../types/City.ts";

export function formatCity(city: City): string {
  return `${city.name}, ${city.country}`;
}
