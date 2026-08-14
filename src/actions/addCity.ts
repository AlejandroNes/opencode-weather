import { findCity } from "../api/geocoding.ts";
import { ask } from "../presentation/input.ts";
import { showError, showSuccess } from "../presentation/output.ts";
import { addCity as saveCity, persistCities, type SavedData } from "../storage/citiesStorage.ts";

export async function addCity(data: SavedData): Promise<void> {
  const cityName = ask("Ingresa el nombre de una ciudad: ");
  if (!cityName) return showError("Debes ingresar una ciudad.");

  const city = await findCity(cityName);
  if (!city) return showError("No se encontró esa ciudad.");

  if (!saveCity(data, city)) {
    showError("Esa ciudad ya está guardada.");
    return;
  }
  await persistCities(data);
  showSuccess(`${city.name}, ${city.country} fue agregada.`);
}
