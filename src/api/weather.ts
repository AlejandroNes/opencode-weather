import { WEATHER_URL } from "../utils/constants.ts";
import type { City } from "../types/City.ts";
import type { Weather } from "../types/Weather.ts";

type WeatherResponse = {
  current?: { temperature_2m?: number };
  current_units?: { temperature_2m?: string };
};

export async function getCurrentWeather(city: City): Promise<Weather> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: "temperature_2m",
  });
  const response = await fetch(`${WEATHER_URL}?${params}`);
  if (!response.ok) throw new Error(`Weather API respondió con HTTP ${response.status}.`);

  const data = await response.json() as WeatherResponse;
  const temperature = data.current?.temperature_2m;
  if (typeof temperature !== "number") throw new Error("La respuesta no contiene la temperatura actual.");

  return { temperature, unit: data.current_units?.temperature_2m ?? "°C" };
}
