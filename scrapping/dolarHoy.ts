import { DOLAR_HOY, TIPOS } from "../constants";
import { chromium } from "playwright";
import CotizacionService from "../services/cotizacion.service";

export async function getBlueDolarHoy() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(DOLAR_HOY);

  const DOLAR_HOY_BLUE = await page.textContent(".values");
  if (!DOLAR_HOY_BLUE) {
    return new Error("No se pudo obtener la cotizacion del Dolar Hoy");
  }
  const UPDATED = await page.textContent(".update");
  if (!UPDATED) {
    return new Error(
      "No se pudo obtener la fecha de actualizacion del Dolar Hoy"
    );
  }
  const formated = DOLAR_HOY_BLUE.trim()
    .replace("Compra", "")
    .replace("Venta", "")
    .replace(/\s+/g, " ");
  const compra = Number(formated.split("$")[1].replace(",", "."));
  const venta = Number(formated.split("$")[2].replace(",", "."));
  await browser.close();

  return {
    moneda: "Dolar",
    tipo: TIPOS.BLUE,
    fecha: new Date(),
    compra,
    venta,
    entidad: "Dolar Hoy",
  };
}

export async function getDolarOficialPromedio() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(DOLAR_HOY);

  // Buscamos el elemento <a> con la clase "title"
  const aElement = await page.$('a[href="/cotizaciondolaroficial"] + div');

  if (!aElement) {
    return new Error("No se pudo obtener la cotizacion del Dolar Hoy");
  }
  // Obtenemos el valor del div dentro del elemento <a>
  const text = await aElement.textContent().then((text) => {
    return text
      ?.replace("Compra", "")
      .replace("Venta", "")
      .replace(/\s+/g, " ")
      .trim()
      .split("$");
  });

  if (!text) {
    return new Error("No se pudo obtener la cotizacion del Dolar Hoy");
  }
  // Formateamos el texto y lo convertimos a numero
  const compra = Number(text[1].replace(",", "."));
  const venta = Number(text[2].replace(",", "."));
  await browser.close();

  return {
    moneda: "Dolar",
    tipo: TIPOS.OFICIAL,
    fecha: new Date(),
    compra,
    venta,
    entidad: "Dolar Hoy",
  };
}

export async function createCotizacionDolarHoy() {
  // Dolar Blue
  const blue_dolar_hoy = await getBlueDolarHoy();
  if (blue_dolar_hoy instanceof Error) {
    return blue_dolar_hoy;
  }
  const createCotizacion = await CotizacionService.createCotizacion(
    blue_dolar_hoy,
    "Dolar Hoy"
  );

  if (!createCotizacion) return false;

  // Dolar Oficial
  const oficial_dolar_hoy = await getDolarOficialPromedio();
  if (oficial_dolar_hoy instanceof Error) {
    return oficial_dolar_hoy;
  }
  const createCotizacion2 = await CotizacionService.createCotizacion(
    oficial_dolar_hoy,
    "Dolar Hoy"
  );
  if (!createCotizacion2) return false;
  return true;
}
