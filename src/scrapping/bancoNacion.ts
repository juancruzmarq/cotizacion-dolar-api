import { BANCO_NACION, Cotizacion, TIPOS } from "../constants";
import { Browser, chromium } from "playwright";
import CotizacionService from "../services/cotizacion.service";
import { ErrorService } from "../services/error.service";
import EntidadService from "../services/entidad.service";
import { Entidad } from "@prisma/client";

async function getOficial(
  browser: Browser,
  id: number
): Promise<Cotizacion | Error> {
  try {
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

    return {
      moneda: "Dolar",
      tipo: TIPOS.OFICIAL,
      fecha: new Date(year, month, day),
      compra,
      venta,
      EntidadId: id,
    };
  } catch (error) {
    return new Error("No se pudo obtener la cotizacion del Banco Nacion");
  }
}

async function createOficial(
  banco_nacion: Entidad,
  browser: Browser
): Promise<Boolean> {
  const oficial_banco_nacion = await getOficial(browser, banco_nacion.id);

  if (oficial_banco_nacion instanceof Error) {
    await ErrorService.createError({
      mensaje: oficial_banco_nacion.message,
      file: "bancoNacion.ts",
      line: 11,
      tipo: TIPOS.OFICIAL,
      moneda: "Dolar",
      EntidadId: banco_nacion.id,
    });
    return false;
  } else {
    const createCotizacion = await CotizacionService.createCotizacion(
      oficial_banco_nacion
    );
    if (createCotizacion instanceof Error) {
      await ErrorService.createError({
        mensaje: createCotizacion.message,
        file: "bancoNacion.ts",
        line: 55,
        tipo: TIPOS.OFICIAL,
        moneda: "Dolar",
        EntidadId: banco_nacion.id,
      });
      return false;
    }
  }
  return true;
}


export async function createCotizacionBancoNacion(
  browser: Browser
): Promise<Boolean> {
  const banco_nacion = await EntidadService.getEntidadByNombre("Banco Nacion");
  if (banco_nacion instanceof Error) return false;

  const oficial = await createOficial(banco_nacion, browser);

  return oficial;
}
