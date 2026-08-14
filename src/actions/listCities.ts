import { getWeather } from "./getWeather.ts";
import { showError } from "../presentation/output.ts";
import type { SavedData } from "../storage/settingsStorage.ts";

export async function listCities(data: SavedData): Promise<void> {
  if (data.cities.length === 0) {
    showError("No hay ciudades guardadas.");
    return;
  }

  for (const city of data.cities) {
    await getWeather(city);
  }
}
