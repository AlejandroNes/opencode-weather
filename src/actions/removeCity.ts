import { ask } from "../presentation/input.ts";
import { showError, showSuccess } from "../presentation/output.ts";
import { removeCity as deleteCity, type SavedData } from "../storage/citiesStorage.ts";

export async function removeCity(data: SavedData): Promise<void> {
  const cityName = ask("Ingresa la ciudad que quieres eliminar: ");
  if (!cityName) return showError("Debes ingresar una ciudad.");

  const city = await deleteCity(data, cityName);
  if (!city) return showError("No se encontró esa ciudad guardada.");
  showSuccess(`${city.name}, ${city.country} fue eliminada.`);
}
