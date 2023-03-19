import { Cotizacion, LA_NACION, TIPOS } from "../constants";
import { Browser, chromium } from "playwright";
import CotizacionService from "../services/cotizacion.service";
import { ErrorService } from "../services/error.service";
import { Entidad } from "@prisma/client";
import EntidadService from "../services/entidad.service";

export async function getDolarOficial(
  browser: Browser,
  id: number
): Promise<Cotizacion | Error> {
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(LA_NACION);

    // Buscamos el elemento <a> con la clase "title"
    const aElement = await page.$('a[title="Dólar oficial"] + p');

    if (!aElement) {
      return new Error("No se pudo obtener la cotizacion del La Nacion");
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
      return new Error(
        "No se pudo obtener la cotizacion del dolar oficial de La Nacion"
      );
    }
    // Formateamos el texto y lo convertimos a numero
    const compra = Number(text[1].replace(",", "."));
    const venta = Number(text[2].replace(",", "."));

    return {
      moneda: "Dolar",
      tipo: TIPOS.OFICIAL,
      fecha: new Date(),
      compra,
      venta,
      EntidadId: id,
    };
  } catch (error) {
    return new Error(
      "No se pudo obtener la cotizacion del dolar oficial de La Nacion"
    );
  }
}

async function createOficial(
  la_nacion: Entidad,
  browser: Browser
): Promise<Boolean> {
  const oficial_la_nacion = await getDolarOficial(browser, la_nacion.id);

  if (oficial_la_nacion instanceof Error) {
    await ErrorService.createError({
      mensaje: oficial_la_nacion.message,
      file: "LaNacion.ts",
      line: 58,
      tipo: TIPOS.OFICIAL,
      moneda: "Dolar",
      EntidadId: la_nacion.id,
    });
    return false;
  } else {
    const lastCotizacion = await CotizacionService.createCotizacion(
      oficial_la_nacion
    );
    if (lastCotizacion instanceof Error) {
      await ErrorService.createError({
        mensaje: lastCotizacion.message,
        file: "LaNacion.ts",
        line: 70,
        tipo: TIPOS.OFICIAL,
        moneda: "Dolar",
        EntidadId: la_nacion.id,
      });
      return false;
    }
  }
  return true;
}

export async function getDolarBlue(
  browser: Browser,
  id: number
): Promise<Cotizacion | Error> {
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(LA_NACION);

    // Buscamos el elemento <a> con la clase "title"
    const aElement = await page.$('a[title="Dólar blue"] + p');

    if (!aElement) {
      return new Error("No se pudo obtener la cotizacion del La Nacion - Blue");
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
      return new Error("No se pudo obtener la cotizacion del La Nacion - Blue");
    }
    // Formateamos el texto y lo convertimos a numero
    const compra = Number(text[1].replace(",", "."));
    const venta = Number(text[2].replace(",", "."));
    await browser.close();

    return {
      moneda: "Dolar",
      tipo: TIPOS.BLUE,
      fecha: new Date(),
      compra,
      venta,
      EntidadId: id,
    };
  } catch (error) {
    return new Error("No se pudo obtener la cotizacion del La Nacion - Blue");
  }
}

async function createBlue(
  la_nacion: Entidad,
  browser: Browser
): Promise<Boolean> {
  const blue_la_nacion = await getDolarBlue(browser, la_nacion.id);

  if (blue_la_nacion instanceof Error) {
    await ErrorService.createError({
      mensaje: blue_la_nacion.message,
      file: "LaNacion.ts",
      line: 133,
      tipo: TIPOS.BLUE,
      moneda: "Dolar",
      EntidadId: la_nacion.id,
    });
    return false;
  } else {
    const lastCotizacion = await CotizacionService.createCotizacion(
      blue_la_nacion
    );
    if (lastCotizacion instanceof Error) {
      await ErrorService.createError({
        mensaje: lastCotizacion.message,
        file: "LaNacion.ts",
        line: 145,
        tipo: TIPOS.BLUE,
        moneda: "Dolar",
        EntidadId: la_nacion.id,
      });
      return false;
    }
  }
  return true;
}

export async function createCotizacionLaNacion(
  browser: Browser
): Promise<Boolean> {
  const la_nacion = await EntidadService.getEntidadByNombre("La Nacion");
  if (la_nacion instanceof Error) return false;

  const oficial = await createOficial(la_nacion, browser);
  const blue = await createBlue(la_nacion, browser);

  return oficial && blue;
}
