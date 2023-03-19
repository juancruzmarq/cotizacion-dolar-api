import { createCotizacionBancoNacion } from "./bancoNacion";
import { createCotizacionDolarHoy } from "./dolarHoy";
import { createCotizacionLaNacion } from "./LaNacion";
import { chromium } from "playwright";
import { createCotizacionAmbito } from "./ambito";

export const scrapping = async () => {
  const browser = await chromium.launch();
  const bancoNacion = await createCotizacionBancoNacion(browser);
  const dolarHoy = await createCotizacionDolarHoy(browser);
  const laNacion = await createCotizacionLaNacion(browser);
  const ambito = await createCotizacionAmbito(browser);

  if (ambito && bancoNacion && dolarHoy && laNacion) {
    console.log("Se actualizaron todas las cotizaciones");
  } else {
    console.log("Algunas cotizaciones no se actualizaron");
  }

  await browser.close();
};
