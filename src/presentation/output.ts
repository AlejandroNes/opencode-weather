import type { City } from "../types/City.ts";
import type { Weather } from "../types/Weather.ts";
import { color, COLORS } from "../utils/colors.ts";
import { formatCity } from "../utils/format.ts";

export function showWeather(city: City, weather: Weather): void {
  console.log(`\n${formatCity(city)}`);
  console.log(color(`Temperatura actual: ${weather.temperature}${weather.unit}`, COLORS.yellow));
}

export function showError(message: string): void {
  console.log(color(message, COLORS.red));
}

export function showSuccess(message: string): void {
  console.log(color(message, COLORS.green));
}
