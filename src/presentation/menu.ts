import type { SavedData } from "../storage/settingsStorage.ts";
import { color, COLORS } from "../utils/colors.ts";
import { formatCity } from "../utils/format.ts";

export function showMenu(data: SavedData): void {
  const defaultCity = data.defaultCity ? formatCity(data.defaultCity) : "No configurada";
  console.log(color("\n════════════════════════════════════════", COLORS.cyan));
  console.log(color("         WEATHER CLI", COLORS.cyan));
  console.log(color("════════════════════════════════════════", COLORS.cyan));
  console.log(color("  1. Clima de ciudad default", COLORS.cyan));
  console.log(color(`  2. Clima de todas las ciudades (${data.cities.length})`, COLORS.cyan));
  console.log(color("  3. Buscar y agregar ciudad", COLORS.cyan));
  console.log(color("  4. Eliminar ciudad", COLORS.cyan));
  console.log(color("  5. Establecer ciudad default", COLORS.cyan));
  console.log(color("  8. Ajustes (°C)", COLORS.cyan));
  console.log(color("  9. Salir", COLORS.cyan));
  console.log(color(`\n  Ciudad default: ${defaultCity}`, COLORS.cyan));
  console.log(color("════════════════════════════════════════", COLORS.cyan));
}
