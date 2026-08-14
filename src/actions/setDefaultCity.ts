import { findCity } from "../api/geocoding.ts";
import { ask } from "../presentation/input.ts";
import { showError, showSuccess } from "../presentation/output.ts";
import { setDefaultCity as saveDefault, type SavedData } from "../storage/settingsStorage.ts";

export async function setDefaultCity(data: SavedData): Promise<void> {
  const cityName = ask("Ingresa la ciudad que quieres establecer como default: ");
  if (!cityName) return showError("Debes ingresar una ciudad.");

  const city = await findCity(cityName);
  if (!city) return showError("No se encontró esa ciudad.");
  await saveDefault(data, city);
  showSuccess(`${city.name}, ${city.country} es ahora tu ciudad default.`);
}
