import { afterEach, describe, expect, mock, spyOn, test } from "bun:test";
import { addCity, removeCity } from "../src/storage/citiesStorage.ts";
import { loadData, setDefaultCity, type SavedData } from "../src/storage/settingsStorage.ts";
import type { City } from "../src/types/City.ts";

const paris: City = { name: "París", country: "Francia", latitude: 48.8566, longitude: 2.3522 };
const madrid: City = { name: "Madrid", country: "España", latitude: 40.4168, longitude: -3.7038 };

afterEach(() => mock.restore());

describe("almacenamiento", () => {
  test("agrega una ciudad y evita duplicados por nombre y país", () => {
    const data: SavedData = { cities: [] };

    expect(addCity(data, paris)).toBe(true);
    expect(addCity(data, paris)).toBe(false);
    expect(data.cities).toEqual([paris]);
  });

  test("elimina una ciudad sin distinguir mayúsculas y limpia la ciudad default", async () => {
    const data: SavedData = { cities: [paris, madrid], defaultCity: paris };
    spyOn(Bun, "write").mockResolvedValue(1);

    await expect(removeCity(data, "PARÍS")).resolves.toEqual(paris);
    expect(data.cities).toEqual([madrid]);
    expect(data.defaultCity).toBeUndefined();
    expect(Bun.write).toHaveBeenCalledTimes(1);
  });

  test("devuelve null al eliminar una ciudad inexistente", async () => {
    const data: SavedData = { cities: [paris] };

    await expect(removeCity(data, "Roma")).resolves.toBeNull();
    expect(data.cities).toEqual([paris]);
  });

  test("establece la ciudad default, la agrega si no existe y persiste", async () => {
    const data: SavedData = { cities: [] };
    spyOn(Bun, "write").mockResolvedValue(1);

    await setDefaultCity(data, madrid);

    expect(data).toEqual({ cities: [madrid], defaultCity: madrid });
    expect(Bun.write).toHaveBeenCalledTimes(1);
  });

  test("loadData normaliza datos inválidos y recupera la ciudad default", async () => {
    spyOn(Bun, "file").mockReturnValue({
      json: async () => ({ defaultCity: paris }),
    } as unknown as Bun.BunFile);

    await expect(loadData()).resolves.toEqual({ cities: [paris], defaultCity: paris });
  });

  test("loadData devuelve una lista vacía si el archivo no puede leerse", async () => {
    spyOn(Bun, "file").mockReturnValue({
      json: async () => { throw new Error("archivo inválido"); },
    } as unknown as Bun.BunFile);

    await expect(loadData()).resolves.toEqual({ cities: [] });
  });
});
