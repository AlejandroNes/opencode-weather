import { addCity } from "./actions/addCity.ts";
import { getWeather } from "./actions/getWeather.ts";
import { listCities } from "./actions/listCities.ts";
import { removeCity } from "./actions/removeCity.ts";
import { setDefaultCity } from "./actions/setDefaultCity.ts";
import { ask } from "./presentation/input.ts";
import { showError, showSuccess } from "./presentation/output.ts";
import { showMenu } from "./presentation/menu.ts";
import { loadData } from "./storage/settingsStorage.ts";
import { color, COLORS } from "./utils/colors.ts";

async function main(): Promise<void> {
  const data = await loadData();

  while (true) {
    showMenu(data);
    const option = ask(color("Selecciona una opción: ", COLORS.cyan));

    if (option === null) {
      showSuccess("\nEntrada finalizada. Hasta pronto.");
      return;
    }

    try {
      if (option === "1") {
        if (!data.defaultCity) showError("Primero debes configurar una ciudad default.");
        else await getWeather(data.defaultCity);
      } else if (option === "2") {
        await listCities(data);
      } else if (option === "3") {
        await addCity(data);
      } else if (option === "4") {
        await removeCity(data);
      } else if (option === "5") {
        await setDefaultCity(data);
      } else if (option === "8") {
        showSuccess("La unidad configurada es Celsius (°C).");
      } else if (option === "9") {
        showSuccess("Hasta pronto.");
        return;
      } else {
        showError("Opción no disponible.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido.";
      showError(`No se pudo completar la operación: ${message}`);
    }
  }
}

await main();
