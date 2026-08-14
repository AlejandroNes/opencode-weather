import { afterEach, describe, expect, test } from "bun:test";
import { findCity } from "../src/api/geocoding.ts";
import { getCurrentWeather } from "../src/api/weather.ts";
import type { City } from "../src/types/City.ts";

const originalFetch = globalThis.fetch;
const city: City = {
  name: "Ottawa",
  country: "Canadá",
  latitude: 45.41117,
  longitude: -75.69812,
};

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function mockFetch(handler: (input: string | URL | Request) => Promise<Response>): void {
  globalThis.fetch = handler as typeof fetch;
}

describe("Open-Meteo APIs", () => {
  test("findCity construye la petición y devuelve la primera ciudad válida", async () => {
    let requestedUrl = "";
    mockFetch(async (input) => {
      requestedUrl = String(input);
      return new Response(JSON.stringify({
        results: [{ name: "Ottawa", country: "Canadá", latitude: 45.41117, longitude: -75.69812 }],
      }), { status: 200 });
    });

    await expect(findCity("Ottawa")).resolves.toEqual(city);
    expect(requestedUrl).toContain("name=Ottawa");
    expect(requestedUrl).toContain("count=1");
    expect(requestedUrl).toContain("language=es");
  });

  test("findCity devuelve null cuando no encuentra resultados válidos", async () => {
    mockFetch(async () => new Response(JSON.stringify({ results: [] }), { status: 200 }));

    await expect(findCity("Ciudad inexistente")).resolves.toBeNull();
  });

  test("findCity informa errores HTTP", async () => {
    mockFetch(async () => new Response(null, { status: 503 }));

    await expect(findCity("Ottawa")).rejects.toThrow("HTTP 503");
  });

  test("getCurrentWeather devuelve temperatura y unidad", async () => {
    let requestedUrl = "";
    mockFetch(async (input) => {
      requestedUrl = String(input);
      return new Response(JSON.stringify({
        current: { temperature_2m: 18.4 },
        current_units: { temperature_2m: "°C" },
      }), { status: 200 });
    });

    await expect(getCurrentWeather(city)).resolves.toEqual({ temperature: 18.4, unit: "°C" });
    expect(requestedUrl).toContain("latitude=45.41117");
    expect(requestedUrl).toContain("longitude=-75.69812");
    expect(requestedUrl).toContain("current=temperature_2m");
  });

  test("getCurrentWeather rechaza respuestas sin temperatura", async () => {
    mockFetch(async () => new Response(JSON.stringify({ current: {} }), { status: 200 }));

    await expect(getCurrentWeather(city)).rejects.toThrow("no contiene la temperatura");
  });
});
