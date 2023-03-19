import { DOLAR_HOY, TIPOS, Cotizacion } from "../constants";
import { Browser, chromium } from "playwright";
import CotizacionService from "../services/cotizacion.service";
import { ErrorService } from "../services/error.service";
import EntidadService from "../services/entidad.service";
import { Entidad } from "@prisma/client";

async function getBlueDolarHoy(
  browser: Browser,
  id: number
): Promise<Cotizacion | Error> {
  try {
    // Open a new page
    const page = await browser.newPage();
    await page.goto(DOLAR_HOY);

    // Buscamos el elemento
    const DOLAR_HOY_BLUE = await page.textContent(".values");

    // Si no se pudo obtener la cotizacion, creamos un error
    if (!DOLAR_HOY_BLUE) {
      return new Error("No se pudo obtener la cotizacion de Dolar Hoy - Blue");
    }

    const UPDATED = await page.textContent(".update");

    // Si no se pudo obtener la fecha de actualizacion, creamos un error
    if (!UPDATED) {
      return new Error("No se pudo obtener la cotizacion de Dolar Hoy - Blue");
    }

    // Formateamos la fecha de actualizacion
    const formated = DOLAR_HOY_BLUE.trim()
      .replace("Compra", "")
      .replace("Venta", "")
      .replace(/\s+/g, " ");
    const compra = Number(formated.split("$")[1].replace(",", "."));
    const venta = Number(formated.split("$")[2].replace(",", "."));

    // Creamos la cotizacion
    return {
      moneda: "Dolar",
      tipo: TIPOS.BLUE,
      fecha: new Date(),
      compra,
      venta,
      EntidadId: id,
    };
  } catch (error) {
    return new Error("No se pudo obtener la cotizacion de Dolar Hoy - Blue");
  }
}

async function createBlue(
  dolar_hoy: Entidad,
  browser: Browser
): Promise<Boolean> {
  const blue = await getBlueDolarHoy(browser, dolar_hoy.id);

  if (blue instanceof Error) {
    await ErrorService.createError({
      mensaje: "No se pudo obtener la cotizacion de Dolar Hoy - Blue",
      file: "dolarHoy.ts",
      line: 63,
      tipo: TIPOS.BLUE,
      moneda: "Dolar",
      EntidadId: dolar_hoy.id,
    });
    return false;
  } else {
    const createBlue = await CotizacionService.createCotizacion(blue);
    if (createBlue instanceof Error) {
      await ErrorService.createError({
        mensaje: "No se pudo obtener la cotizacion de Dolar Hoy - Blue",
        file: "dolarHoy.ts",
        line: 67,
        tipo: TIPOS.BLUE,
        moneda: "Dolar",
        EntidadId: dolar_hoy.id,
      });
      return false;
    }
  }
  return true;
}

async function getDolarOficialPromedio(
  browser: Browser,
  id: number
): Promise<Cotizacion | Error> {
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(DOLAR_HOY);

    // Buscamos el elemento <a> con la clase "title"
    const aElement = await page.$('a[href="/cotizaciondolaroficial"] + div');

    if (!aElement) {
      return new Error(
        "No se pudo obtener la cotizacion de Dolar Hoy - Oficial"
      );
    }

    // Obtenemos el valor del div dentro del elemento <a>
    const texto = await aElement.textContent().then((text) => {
      return text
        ?.replace("Compra", "")
        .replace("Venta", "")
        .replace(/\s+/g, " ")
        .trim()
        .split("$");
    });

    if (!texto) {
      return new Error(
        "No se pudo obtener la cotizacion de Dolar Hoy - Oficial"
      );
    }
    // Formateamos el texto y lo convertimos a numero
    const compra = Number(texto[1].replace(",", "."));
    const venta = Number(texto[2].replace(",", "."));

    return {
      moneda: "Dolar",
      tipo: TIPOS.OFICIAL,
      fecha: new Date(),
      compra,
      venta,
      EntidadId: id,
    };
  } catch (error) {
    return new Error("No se pudo obtener la cotizacion de Dolar Hoy - Oficial");
  }
}

async function createOficial(
  dolar_hoy: Entidad,
  browser: Browser
): Promise<Boolean> {
  const oficial = await getDolarOficialPromedio(browser, dolar_hoy.id);

  if (oficial instanceof Error) {
    await ErrorService.createError({
      mensaje: oficial.message,
      file: "dolarHoy.ts",
      line: 141,
      tipo: TIPOS.OFICIAL,
      moneda: "Dolar",
      EntidadId: dolar_hoy.id,
    });
    return false;
  } else {
    const createOficial = await CotizacionService.createCotizacion(oficial);
    if (createOficial instanceof Error) {
      await ErrorService.createError({
        mensaje: createOficial.message,
        file: "dolarHoy.ts",
        line: 154,
        tipo: TIPOS.OFICIAL,
        moneda: "Dolar",
        EntidadId: dolar_hoy.id,
      });
      return false;
    }
  }
  return true;
}

async function getDolarBolsa(
  browser: Browser,
  id: number
): Promise<Cotizacion | Error> {
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(DOLAR_HOY);

    // Buscamos el elemento <a> con la clase "title"
    const aElement = await page.$('a[href="/cotizaciondolarbolsa"] + div');

    if (!aElement) {
      return new Error("No se pudo obtener la cotizacion de Dolar Hoy - Bolsa");
    }
    // Obtenemos el valor del div dentro del elemento <a>
    const texto = await aElement.textContent().then((text) => {
      return text
        ?.replace("Compra", "")
        .replace("Venta", "")
        .replace(/\s+/g, " ")
        .trim()
        .split("$");
    });

    if (!texto) {
      return new Error("No se pudo obtener la cotizacion de Dolar Hoy - Bolsa");
    }
    // Formateamos el texto y lo convertimos a numero
    const compra = Number(texto[1].replace(",", "."));
    const venta = Number(texto[2].replace(",", "."));

    return {
      moneda: "Dolar",
      tipo: TIPOS.BOLSA,
      fecha: new Date(),
      compra,
      venta,
      EntidadId: id,
    };
  } catch (error) {
    return new Error("No se pudo obtener la cotizacion de Dolar Hoy - Bolsa");
  }
}

async function createBolsa(
  dolar_hoy: Entidad,
  browser: Browser
): Promise<Boolean> {
  const bolsa = await getDolarBolsa(browser, dolar_hoy.id);

  if (bolsa instanceof Error) {
    await ErrorService.createError({
      mensaje: bolsa.message,
      file: "dolarHoy.ts",
      line: 212,
      tipo: TIPOS.BOLSA,
      moneda: "Dolar",
      EntidadId: dolar_hoy.id,
    });
    return false;
  } else {
    const createBolsa = await CotizacionService.createCotizacion(bolsa);
    if (createBolsa instanceof Error) {
      await ErrorService.createError({
        mensaje: createBolsa.message,
        file: "dolarHoy.ts",
        line: 225,
        tipo: TIPOS.BOLSA,
        moneda: "Dolar",
        EntidadId: dolar_hoy.id,
      });
      return false;
    }
  }
  return true;
}

async function getDolarContadoConLiqui(
  browser: Browser,
  id: number
): Promise<Cotizacion | Error> {
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(DOLAR_HOY);

    // Buscamos el elemento <a> con la clase "title"
    const aElement = await page.$(
      'a[href="/cotizaciondolarcontadoconliqui"] + div'
    );

    if (!aElement) {
      return new Error(
        "No se pudo obtener la cotizacion de Dolar Hoy - Contado con Liqui"
      );
    }
    // Obtenemos el valor del div dentro del elemento <a>
    const texto = await aElement.textContent().then((text) => {
      return text
        ?.replace("Compra", "")
        .replace("Venta", "")
        .replace(/\s+/g, " ")
        .trim()
        .split("$");
    });

    if (!texto) {
      return new Error(
        "No se pudo obtener la cotizacion de Dolar Hoy - Contado con Liqui"
      );
    }
    // Formateamos el texto y lo convertimos a numero
    const compra = Number(texto[1].replace(",", "."));
    const venta = Number(texto[2].replace(",", "."));

    return {
      moneda: "Dolar",
      tipo: TIPOS.CONTADO_CON_LIQUIDACION,
      fecha: new Date(),
      compra,
      venta,
      EntidadId: id,
    };
  } catch (error) {
    return new Error(
      "No se pudo obtener la cotizacion de Dolar Hoy - Contado con Liqui"
    );
  }
}

async function createContadoConLiqui(
  dolar_hoy: Entidad,
  browser: Browser
): Promise<Boolean> {
  const contadoConLiqui = await getDolarContadoConLiqui(browser, dolar_hoy.id);

  if (contadoConLiqui instanceof Error) {
    await ErrorService.createError({
      mensaje: contadoConLiqui.message,
      file: "dolarHoy.ts",
      line: 296,
      tipo: TIPOS.CONTADO_CON_LIQUIDACION,
      moneda: "Dolar",
      EntidadId: dolar_hoy.id,
    });
    return false;
  } else {
    const createContadoConLiqui = await CotizacionService.createCotizacion(
      contadoConLiqui
    );
    if (createContadoConLiqui instanceof Error) {
      await ErrorService.createError({
        mensaje: createContadoConLiqui.message,
        file: "dolarHoy.ts",
        line: 309,
        tipo: TIPOS.CONTADO_CON_LIQUIDACION,
        moneda: "Dolar",
        EntidadId: dolar_hoy.id,
      });
      return false;
    }
  }
  return true;
}

export async function getDolarCripto(
  browser: Browser,
  id: number
): Promise<Cotizacion | Error> {
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(DOLAR_HOY);

    // Buscamos el elemento <a> con la clase "title"
    const aElement = await page.$('a[href="/seccion/bitcoins"] + div');

    if (!aElement) {
      return new Error(
        "No se pudo obtener la cotizacion del Dolar Hoy - Cripto"
      );
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
        "No se pudo obtener la cotizacion del Dolar Hoy - Cripto"
      );
    }
    // Formateamos el texto y lo convertimos a numero
    const compra = Number(text[1].replace(",", "."));
    const venta = Number(text[2].replace(",", "."));

    return {
      moneda: "Dolar",
      tipo: TIPOS.CRIPTO,
      fecha: new Date(),
      compra,
      venta,
      EntidadId: id,
    };
  } catch (error) {
    return new Error("No se pudo obtener la cotizacion del Dolar Hoy - Cripto");
  }
}

async function createCripto(
  dolar_hoy: Entidad,
  browser: Browser
): Promise<Boolean> {
  const cripto = await getDolarCripto(browser, dolar_hoy.id);

  if (cripto instanceof Error) {
    await ErrorService.createError({
      mensaje: cripto.message,
      file: "dolarHoy.ts",
      line: 362,
      tipo: TIPOS.CRIPTO,
      moneda: "Dolar",
      EntidadId: dolar_hoy.id,
    });
    return false;
  } else {
    const createCripto = await CotizacionService.createCotizacion(cripto);
    if (createCripto instanceof Error) {
      await ErrorService.createError({
        fecha: new Date(),
        mensaje: createCripto.message,
        file: "dolarHoy.ts",
        line: 374,
        tipo: TIPOS.CRIPTO,
        moneda: "Dolar",
        EntidadId: dolar_hoy.id,
      });
      return false;
    }
  }
  return true;
}

export async function getDolarTurista(
  browser: Browser,
  id: number
): Promise<Cotizacion | Error> {
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(DOLAR_HOY);

    // Buscamos el elemento <a> con la clase "title"
    const aElement = await page.$('a[href="/cotizaciondolarturista"] + div');

    if (!aElement) {
      return new Error(
        "No se pudo obtener la cotizacion del Dolar Hoy - Turista"
      );
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
        "No se pudo obtener la cotizacion del Dolar Hoy - Turista"
      );
    }
    // Formateamos el texto y lo convertimos a numero
    const venta = Number(text[1].replace(",", "."));

    return {
      moneda: "Dolar",
      tipo: TIPOS.TURISTA,
      fecha: new Date(),
      venta,
      EntidadId: id,
    };
  } catch (error) {
    return new Error(
      "No se pudo obtener la cotizacion del Dolar Hoy - Turista"
    );
  }
}

async function createTurista(
  dolar_hoy: Entidad,
  browser: Browser
): Promise<Boolean> {
  const turista = await getDolarTurista(browser, dolar_hoy.id);

  if (turista instanceof Error) {
    await ErrorService.createError({
      mensaje: turista.message,
      file: "dolarHoy.ts",
      line: 443,
      tipo: TIPOS.TURISTA,
      moneda: "Dolar",
      EntidadId: dolar_hoy.id,
    });
    return false;
  } else {
    const createTurista = await CotizacionService.createCotizacion(turista);
    if (createTurista instanceof Error) {
      await ErrorService.createError({
        fecha: new Date(),
        mensaje: createTurista.message,
        file: "dolarHoy.ts",
        line: 455,
        tipo: TIPOS.TURISTA,
        moneda: "Dolar",
        EntidadId: dolar_hoy.id,
      });
      return false;
    }
  }
  return true;
}

export async function createCotizacionDolarHoy(
  browser: Browser
): Promise<Boolean> {
  const dolar_hoy = await EntidadService.getEntidadByNombre("Dolar Hoy");
  if (dolar_hoy instanceof Error) return false;

  const blue = await createBlue(dolar_hoy, browser);
  const oficial = await createOficial(dolar_hoy, browser);
  const contado = await createContadoConLiqui(dolar_hoy, browser);
  const bolsa = await createBolsa(dolar_hoy, browser);
  const cripto = await createCripto(dolar_hoy, browser);
  const turista = await createTurista(dolar_hoy, browser);

  return blue && oficial && contado && cripto && turista && bolsa;
}
