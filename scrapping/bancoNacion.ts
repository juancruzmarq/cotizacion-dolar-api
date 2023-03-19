import { BANCO_NACION, Cotizacion, TIPOS } from "../constants";
import { chromium } from "playwright";
import CotizacionService from "../services/cotizacion.service";

export async function getOficialBancoNacion(): Promise<Cotizacion | Error> {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(BANCO_NACION);

  const BANCO_NACION_OFICIAL = await page.textContent(".cotizacion");
  if (!BANCO_NACION_OFICIAL) {
    return new Error("No se pudo obtener la cotizacion del Banco Nacion");
  }

  const formated = BANCO_NACION_OFICIAL.trim().replace(/\s+/g, " ");
  const compra = Number(formated.split(" ")[5].replace(",", "."));
  const venta = Number(formated.split(" ")[6].replace(",", "."));
  const fecha = formated.split(" ")[0].trim();
  const year = Number(fecha.split("/")[2]);
  const month = Number(fecha.split("/")[1]);
  const day = Number(fecha.split("/")[0]);
  await browser.close();

  return {
    moneda: "Dolar",
    tipo: TIPOS.OFICIAL,
    fecha: new Date(year, month, day),
    compra,
    venta,
    EntidadId: "Banco Nacion",
  };
}

export async function createCotizacionBancoNacion() {
  const oficial_banco_nacion = await getOficialBancoNacion();
  if (oficial_banco_nacion instanceof Error) {
    return false;
  }
  const createCotizacion = await CotizacionService.createCotizacion(
    oficial_banco_nacion,
    "Banco Nacion"
  );
  if (!createCotizacion) {
    return false;
  }
  return true;
}
