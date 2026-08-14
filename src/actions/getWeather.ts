import { getCurrentWeather } from "../api/weather.ts";
import type { City } from "../types/City.ts";
import { showWeather } from "../presentation/output.ts";

export async function getWeather(city: City): Promise<void> {
  showWeather(city, await getCurrentWeather(city));
}
