import { describe, expect, test } from "bun:test";
import { color, COLORS } from "../src/utils/colors.ts";
import { formatCity } from "../src/utils/format.ts";
import type { City } from "../src/types/City.ts";

describe("utilidades", () => {
  test("formatea una ciudad con nombre y país", () => {
    const city: City = { name: "Bogotá", country: "Colombia", latitude: 4.711, longitude: -74.0721 };

    expect(formatCity(city)).toBe("Bogotá, Colombia");
  });

  test("aplica color y restablece la terminal", () => {
    expect(color("Clima", COLORS.cyan)).toBe("\x1b[36mClima\x1b[0m");
  });
});
