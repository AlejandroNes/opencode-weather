import type { City } from "../types/City.ts";
import { saveData, type SavedData } from "./settingsStorage.ts";

export type { SavedData } from "./settingsStorage.ts";

export function addCity(data: SavedData, city: City): boolean {
  if (data.cities.some((savedCity) => savedCity.name === city.name && savedCity.country === city.country)) {
    return false;
  }

  data.cities.push(city);
  return true;
}

export async function persistCities(data: SavedData): Promise<void> {
  await saveData(data);
}

export async function removeCity(data: SavedData, cityName: string): Promise<City | null> {
  const index = data.cities.findIndex((city) => city.name.toLowerCase() === cityName.toLowerCase());
  if (index < 0) return null;

  const [removedCity] = data.cities.splice(index, 1);
  if (!removedCity) return null;
  if (data.defaultCity?.name === removedCity.name && data.defaultCity.country === removedCity.country) {
    data.defaultCity = undefined;
  }
  await persistCities(data);
  return removedCity;
}
