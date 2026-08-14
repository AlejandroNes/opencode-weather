import { DATA_FILE } from "../utils/constants.ts";
import type { City } from "../types/City.ts";

export type SavedData = {
  cities: City[];
  defaultCity?: City;
};

export async function loadData(): Promise<SavedData> {
  try {
    const data = await Bun.file(DATA_FILE).json() as Partial<SavedData> & { defaultCity?: City };
    const cities = Array.isArray(data.cities) ? data.cities : [];

    if (data.defaultCity && cities.length === 0) {
      cities.push(data.defaultCity);
    }

    return { cities, defaultCity: data.defaultCity };
  } catch {
    return { cities: [] };
  }
}

export async function saveData(data: SavedData): Promise<void> {
  await Bun.write(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function setDefaultCity(data: SavedData, city: City): Promise<void> {
  data.defaultCity = city;
  if (!data.cities.some((savedCity) => savedCity.name === city.name && savedCity.country === city.country)) {
    data.cities.push(city);
  }
  await saveData(data);
}
