const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
const DATA_FILE = `${import.meta.dir}/.weather-data.json`;
const COLORS = {
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  reset: "\x1b[0m",
} as const;

function color(text: string, colorCode: string): string {
  return `${colorCode}${text}${COLORS.reset}`;
}

type Location = {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
};

type SavedData = {
  defaultCity?: Location;
};

type GeocodingResponse = {
  results?: Array<{
    name?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  }>;
};

type WeatherResponse = {
  current?: {
    temperature_2m?: number;
  };
  current_units?: {
    temperature_2m?: string;
  };
};

function ask(message: string): string | null {
  const answer = prompt(message);
  return answer === null ? null : answer.trim();
}

async function loadData(): Promise<SavedData> {
  try {
    const data = await Bun.file(DATA_FILE).json();
    if (data && typeof data === "object" && "defaultCity" in data) {
      return data as SavedData;
    }
  } catch {
    // The file is optional and is created after the first saved city.
  }

  return {};
}

async function saveData(data: SavedData): Promise<void> {
  await Bun.write(DATA_FILE, JSON.stringify(data, null, 2));
}

async function findCity(cityName: string): Promise<Location | null> {
  const params = new URLSearchParams({
    name: cityName,
    count: "1",
    language: "es",
    format: "json",
  });
  const response = await fetch(`${GEOCODING_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Geocoding API respondió con HTTP ${response.status}.`);
  }

  const data = (await response.json()) as GeocodingResponse;
  const result = data.results?.[0];

  if (
    !result ||
    typeof result.name !== "string" ||
    typeof result.country !== "string" ||
    typeof result.latitude !== "number" ||
    typeof result.longitude !== "number"
  ) {
    return null;
  }

  return {
    name: result.name,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
  };
}

async function getCurrentTemperature(city: Location): Promise<{ temperature: number; unit: string }> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: "temperature_2m",
  });
  const response = await fetch(`${WEATHER_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`Weather API respondió con HTTP ${response.status}.`);
  }

  const data = (await response.json()) as WeatherResponse;
  const temperature = data.current?.temperature_2m;

  if (typeof temperature !== "number") {
    throw new Error("La respuesta no contiene la temperatura actual.");
  }

  return {
    temperature,
    unit: data.current_units?.temperature_2m ?? "°C",
  };
}

async function showWeather(city: Location): Promise<void> {
  const weather = await getCurrentTemperature(city);
  console.log(`\n${city.name}, ${city.country}`);
  console.log(color(`Temperatura actual: ${weather.temperature}${weather.unit}`, COLORS.yellow));
}

function showMenu(data: SavedData): void {
  const defaultCity = data.defaultCity
    ? `${data.defaultCity.name}, ${data.defaultCity.country}`
    : "No configurada";

  console.log(color("\n════════════════════════════════════════", COLORS.cyan));
  console.log(color("         WEATHER CLI", COLORS.cyan));
  console.log(color("════════════════════════════════════════", COLORS.cyan));
  console.log(color("  1. Clima de ciudad predeterminada", COLORS.cyan));
  console.log(color("  3. Buscar clima por ciudad", COLORS.cyan));
  console.log(color("  5. Establecer ciudad predeterminada", COLORS.cyan));
  console.log(color("  9. Salir", COLORS.cyan));
  console.log(color(`\n  Ciudad predeterminada: ${defaultCity}`, COLORS.cyan));
  console.log(color("════════════════════════════════════════", COLORS.cyan));
}

async function searchWeather(data: SavedData): Promise<void> {
  const cityName = ask("Ingresa el nombre de una ciudad: ");
  if (!cityName) {
    console.log(color("Debes ingresar una ciudad.", COLORS.red));
    return;
  }

  const city = await findCity(cityName);
  if (!city) {
    console.log(color("No se encontró esa ciudad.", COLORS.red));
    return;
  }

  await showWeather(city);

  if (ask("¿Guardar como ciudad predeterminada? (s/n): ")?.toLowerCase() === "s") {
    data.defaultCity = city;
    await saveData(data);
    console.log(color("Ciudad predeterminada guardada.", COLORS.green));
  }
}

async function setDefaultCity(data: SavedData): Promise<void> {
  const cityName = ask("Ingresa la ciudad que quieres establecer como predeterminada: ");
  if (!cityName) {
    console.log(color("Debes ingresar una ciudad.", COLORS.red));
    return;
  }

  const city = await findCity(cityName);
  if (!city) {
    console.log(color("No se encontró esa ciudad.", COLORS.red));
    return;
  }

  data.defaultCity = city;
  await saveData(data);
  console.log(color(`${city.name}, ${city.country} es ahora tu ciudad predeterminada.`, COLORS.green));
}

async function main(): Promise<void> {
  const data = await loadData();

  while (true) {
    showMenu(data);
    const option = ask(color("Selecciona una opción: ", COLORS.cyan));

    if (option === null) {
      console.log(color("\nEntrada finalizada. Hasta pronto.", COLORS.green));
      return;
    }

    try {
      if (option === "1") {
        if (!data.defaultCity) {
          console.log(color("Primero debes configurar una ciudad predeterminada.", COLORS.red));
        } else {
          await showWeather(data.defaultCity);
        }
      } else if (option === "3") {
        await searchWeather(data);
      } else if (option === "5") {
        await setDefaultCity(data);
      } else if (option === "9") {
        console.log(color("Hasta pronto.", COLORS.green));
        return;
      } else {
        console.log(color("Opción no disponible en el MVP.", COLORS.red));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido.";
      console.log(color(`No se pudo completar la operación: ${message}`, COLORS.red));
    }
  }
}

await main();
