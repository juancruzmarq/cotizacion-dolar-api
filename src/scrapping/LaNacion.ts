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

async function getTarjeta(
  browser: Browser,
  id: number
): Promise<Cotizacion | Error> {
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(LA_NACION);

    // Buscamos el elemento <a> con la clase "title"
    const aElement = await page.$('a[title="Dólar tarjeta"] + p');

    // Obtenemos el valor del div dentro del elemento <a>
    const text = await aElement?.textContent().then((text) => {
      return text?.replace("Venta", "").replace(/\s+/g, " ").trim().split("$");
    });

    if (!text) {
      return new Error(
        "No se pudo obtener la cotizacion del La Nacion - Tarjeta"
      );
    }
    // Formateamos el texto y lo convertimos a numero
    const venta = Number(text[1].replace(",", "."));

    return {
      moneda: "Dolar",
      tipo: TIPOS.TARJETA,
      fecha: new Date(),
      venta,
      EntidadId: id,
    };
  } catch (error) {
    return new Error(
      "No se pudo obtener la cotizacion del La Nacion - Tarjeta"
    );
  }
}

async function createTarjeta(
  la_nacion: Entidad,
  browser: Browser
): Promise<Boolean> {
  const cotizacion = await getTarjeta(browser, la_nacion.id);

  if (cotizacion instanceof Error) {
    await ErrorService.createError({
      mensaje: cotizacion.message,
      file: "LaNacion.ts",
      line: 221,
      tipo: TIPOS.TARJETA,
      moneda: "Dolar",
      EntidadId: la_nacion.id,
    });
    return false;
  } else {
    const lastCotizacion = await CotizacionService.createCotizacion(cotizacion);
    if (lastCotizacion instanceof Error) {
      await ErrorService.createError({
        mensaje: lastCotizacion.message,
        file: "LaNacion.ts",
        line: 234,
        tipo: TIPOS.TARJETA,
        moneda: "Dolar",
        EntidadId: la_nacion.id,
      });
      return false;
    }
  }
  return true;
}

async function getTurista(
  browser: Browser,
  id: number
): Promise<Cotizacion | Error> {
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(LA_NACION);

    // Buscamos el elemento <a> con la clase "title"
    const aElement = await page.$('a[title="Dólar turista"] + p');

    // Obtenemos el valor del div dentro del elemento <a>
    const text = await aElement?.textContent().then((text) => {
      return text?.replace("Venta", "").replace(/\s+/g, " ").trim().split("$");
    });

    if (!text) {
      return new Error(
        "No se pudo obtener la cotizacion del La Nacion - Turista"
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
      "No se pudo obtener la cotizacion del La Nacion - Turista"
    );
  }
}

async function createTurista(
  la_nacion: Entidad,
  browser: Browser
): Promise<Boolean> {
  const cotizacion = await getTurista(browser, la_nacion.id);

  if (cotizacion instanceof Error) {
    await ErrorService.createError({
      mensaje: cotizacion.message,
      file: "LaNacion.ts",
      line: 289,
      tipo: TIPOS.TURISTA,
      moneda: "Dolar",
      EntidadId: la_nacion.id,
    });
    return false;
  } else {
    const lastCotizacion = await CotizacionService.createCotizacion(cotizacion);
    if (lastCotizacion instanceof Error) {
      await ErrorService.createError({
        mensaje: lastCotizacion.message,
        file: "LaNacion.ts",
        line: 302,
        tipo: TIPOS.TURISTA,
        moneda: "Dolar",
        EntidadId: la_nacion.id,
      });
      return false;
    }
  }
  return true;
}

async function getCCL(
  browser: Browser,
  id: number
): Promise<Cotizacion | Error> {
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(LA_NACION);

    // Buscamos el elemento <a> con la clase "title"
    const aElement = await page.$('a[title="Dólar CCL"] + p');

    // Obtenemos el valor del div dentro del elemento <a>
    const text = await aElement?.textContent().then((text) => {
      return text?.replace("Venta", "").replace(/\s+/g, " ").trim().split("$");
    });

    if (!text) {
      return new Error("No se pudo obtener la cotizacion del La Nacion - CCL");
    }
    // Formateamos el texto y lo convertimos a numero
    const venta = Number(text[1].replace(",", "."));

    return {
      moneda: "Dolar",
      tipo: TIPOS.CCL,
      fecha: new Date(),
      venta,
      EntidadId: id,
    };
  } catch (error) {
    return new Error("No se pudo obtener la cotizacion del La Nacion - CCL");
  }
}

async function createCCL(
  la_nacion: Entidad,
  browser: Browser
): Promise<Boolean> {
  const cotizacion = await getCCL(browser, la_nacion.id);

  if (cotizacion instanceof Error) {
    await ErrorService.createError({
      mensaje: cotizacion.message,
      file: "LaNacion.ts",
      line: 359,
      tipo: TIPOS.CCL,
      moneda: "Dolar",
      EntidadId: la_nacion.id,
    });
    return false;
  } else {
    const lastCotizacion = await CotizacionService.createCotizacion(cotizacion);
    if (lastCotizacion instanceof Error) {
      await ErrorService.createError({
        mensaje: lastCotizacion.message,
        file: "LaNacion.ts",
        line: 372,
        tipo: TIPOS.CCL,
        moneda: "Dolar",
        EntidadId: la_nacion.id,
      });
      return false;
    }
  }
  return true;
}

async function getMEP(
  browser: Browser,
  id: number
): Promise<Cotizacion | Error> {
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(LA_NACION);

    const currencyDataElements = await page.$$(".currency-data");
    let currencyDataElement;

    for (const element of currencyDataElements) {
      const h2Element = await element.$("h2.dolar-title.--fourxs");
      if (h2Element) {
        const h2Text = await h2Element.innerText();
        if (h2Text === "Dólar MEP") {
          currencyDataElement = element;
          break;
        }
      }
    }

    if (currencyDataElement) {
      const ventaElement = await currencyDataElement.$("p");
      if (!ventaElement) {
        return new Error(
          "No se pudo obtener la cotizacion del La Nacion - MEP"
        );
      }
      const venta = await ventaElement.textContent().then((text) => {
        return Number(
          text?.replace("Venta", "").replace(",", ".").trim().split("$")[1]
        );
      });
      return {
        moneda: "Dolar",
        tipo: TIPOS.MEP,
        fecha: new Date(),
        venta,
        EntidadId: id,
      };
    } else {
      return new Error("No se pudo obtener la cotizacion del La Nacion - MEP");
    }
  } catch (error) {
    return new Error("No se pudo obtener la cotizacion del La Nacion - MEP");
  }
}

async function createMEP(
  la_nacion: Entidad,
  browser: Browser
): Promise<Boolean> {
  const cotizacion = await getMEP(browser, la_nacion.id);

  if (cotizacion instanceof Error) {
    await ErrorService.createError({
      mensaje: cotizacion.message,
      file: "LaNacion.ts",
      line: 440,
      tipo: TIPOS.MEP,
      moneda: "Dolar",
      EntidadId: la_nacion.id,
    });
    return false;
  } else {
    const lastCotizacion = await CotizacionService.createCotizacion(cotizacion);
    if (lastCotizacion instanceof Error) {
      await ErrorService.createError({
        mensaje: lastCotizacion.message,
        file: "LaNacion.ts",
        line: 453,
        tipo: TIPOS.MEP,
        moneda: "Dolar",
        EntidadId: la_nacion.id,
      });
      return false;
    }
  }
  return true;
}

async function getMayorista(
  browser: Browser,
  id: number
): Promise<Cotizacion | Error> {
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(LA_NACION);

    const currencyDataElements = await page.$$(".currency-data");
    let currencyDataElement;

    for (const element of currencyDataElements) {
      const h2Element = await element.$("h2.dolar-title.--fourxs");
      if (h2Element) {
        const h2Text = await h2Element.innerText();
        if (h2Text === "Dólar mayorista") {
          currencyDataElement = element;
          break;
        }
      }
    }

    if (currencyDataElement) {
      const ventaElement = await currencyDataElement.$("p");
      if (!ventaElement) {
        return new Error(
          "No se pudo obtener la cotizacion del La Nacion - Mayorista"
        );
      }
      const venta = await ventaElement.textContent().then((text) => {
        return Number(
          text?.replace("Venta", "").replace(",", ".").trim().split("$")[1]
        );
      });
      return {
        moneda: "Dolar",
        tipo: TIPOS.MAYORISTA,
        fecha: new Date(),
        venta,
        EntidadId: id,
      };
    } else {
      return new Error(
        "No se pudo obtener la cotizacion del La Nacion - Mayorista"
      );
    }
  } catch (error) {
    return new Error(
      "No se pudo obtener la cotizacion del La Nacion - Mayorista"
    );
  }
}

async function createMayorista(
  la_nacion: Entidad,
  browser: Browser
): Promise<Boolean> {
  const cotizacion = await getMayorista(browser, la_nacion.id);

  if (cotizacion instanceof Error) {
    await ErrorService.createError({
      mensaje: cotizacion.message,
      file: "LaNacion.ts",
      line: 525,
      tipo: TIPOS.MAYORISTA,
      moneda: "Dolar",
      EntidadId: la_nacion.id,
    });
    return false;
  } else {
    const lastCotizacion = await CotizacionService.createCotizacion(cotizacion);
    if (lastCotizacion instanceof Error) {
      await ErrorService.createError({
        mensaje: lastCotizacion.message,
        file: "LaNacion.ts",
        line: 538,
        tipo: TIPOS.MAYORISTA,
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
  const tarjeta = await createTarjeta(la_nacion, browser);
  const turista = await createTurista(la_nacion, browser);
  const ccl = await createCCL(la_nacion, browser);
  const mep = await createMEP(la_nacion, browser);
  const mayorista = await createMayorista(la_nacion, browser);

  return oficial && blue && tarjeta && turista && ccl && mep && mayorista;
}
