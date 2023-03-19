import { AMBITO, Cotizacion, TIPOS } from "../constants";
import { Browser, Page } from "playwright";
import CotizacionService from "../services/cotizacion.service";
import { ErrorService } from "../services/error.service";
import EntidadService from "../services/entidad.service";

export async function createCotizacionAmbito(
  browser: Browser
): Promise<Boolean> {
  try {
    const page = await browser.newPage();
    await page.goto(AMBITO);

    const ambito = await EntidadService.getEntidadByNombre("Ambito");
    if (ambito instanceof Error) return false;

    const turista = await createCotizacion(
      await soloVenta(page, ambito.id, "/dolarturista", TIPOS.TURISTA),
      TIPOS.TURISTA,
      ambito.id
    );
    const ccl = await createCotizacion(
      await soloVenta(page, ambito.id, "/dolarrava/cl", TIPOS.CCL),
      TIPOS.CCL,
      ambito.id
    );
    const lujo = await createCotizacion(
      await soloVenta(page, ambito.id, "/dolardelujo", TIPOS.LUJO),
      TIPOS.LUJO,
      ambito.id
    );
    const mep = await createCotizacion(
      await soloVenta(page, ambito.id, "/dolarrava/mep", TIPOS.MEP),
      TIPOS.MEP,
      ambito.id
    );
    const ahorro = await createCotizacion(
      await soloVenta(page, ambito.id, "/dolarahorro", TIPOS.AHORRO),
      TIPOS.AHORRO,
      ambito.id
    );
    const qatar = await createCotizacion(
      await soloVenta(page, ambito.id, "/dolarqatar", TIPOS.QATAR),
      TIPOS.QATAR,
      ambito.id
    );
    const coldplay = await createCotizacion(
      await soloVenta(page, ambito.id, "/dolarcoldplay", TIPOS.COLDPLAY),
      TIPOS.COLDPLAY,
      ambito.id
    );
    const blue = await createCotizacion(
      await getCompraVenta(page, ambito.id, "/dolar/informal", TIPOS.BLUE),
      TIPOS.BLUE,
      ambito.id
    );
    const oficial = await createCotizacion(
      await getCompraVenta(page, ambito.id, "/dolar/oficial", TIPOS.OFICIAL),
      TIPOS.OFICIAL,
      ambito.id
    );
    const mayorista = await createCotizacion(
      await getCompraVenta(
        page,
        ambito.id,
        "/dolar/mayorista",
        TIPOS.MAYORISTA
      ),
      TIPOS.MAYORISTA,
      ambito.id
    );
    const futuro = await createCotizacion(
      await getCompraVenta(page, ambito.id, "/dolarfuturo", TIPOS.FUTURO),
      TIPOS.FUTURO,
      ambito.id
    );

    return (
      blue &&
      coldplay &&
      qatar &&
      ahorro &&
      mep &&
      lujo &&
      ccl &&
      turista &&
      oficial &&
      mayorista &&
      futuro
    );
  } catch (error) {
    return false;
  }
}
//
async function soloVenta(
  page: Page,
  id: number,
  url: string,
  tipo: TIPOS
): Promise<Cotizacion | Error> {
  try {
    const ambito_ = await page.$(`[data-indice="${url}"]`);
    if (!ambito_) {
      return new Error(`No se pudo obtener la cotizacion de Ambito - ${tipo}`);
    }
    const text = await ambito_.textContent().then((text) => {
      return text?.trim().replace(/\s+/g, " ").split(" ");
    });
    const venta = Number(text?.[3].replace(",", "."));
    const fecha = text?.[5].trim();
    const year = Number(fecha?.split("/")[2]);
    const month = Number(fecha?.split("/")[1]) - 1;
    const day = Number(fecha?.split("/")[0]);
    const hora = text?.[7].trim();
    const hour = Number(hora?.split(":")[0]);
    const minutes = Number(hora?.split(":")[1]);

    return {
      moneda: "Dolar",
      tipo,
      venta,
      fecha: new Date(year, month, day, hour, minutes),
      EntidadId: id,
    };
  } catch (error) {
    return new Error(`No se pudo obtener la cotizacion de Ambito - ${tipo}`);
  }
}

async function getCompraVenta(
  page: Page,
  id: number,
  url: string,
  tipo: TIPOS
): Promise<Cotizacion | Error> {
  try {
    const ambito_ = await page.$(`[data-indice="${url}"]`);
    if (!ambito_) {
      return new Error(`No se pudo obtener la cotizacion de Ambito - ${tipo}`);
    }
    const text = await ambito_.textContent().then((text) => {
      return text?.trim().replace(/\s+/g, " ").split(" ");
    });

    const compra = Number(text?.[3].replace(",", "."));
    const venta = Number(text?.[5].replace(",", "."));
    const fecha = text?.[7].trim();
    const year = Number(fecha?.split("/")[2]);
    const month = Number(fecha?.split("/")[1]) - 1;
    const day = Number(fecha?.split("/")[0]);
    const hora = text?.[9].trim();
    const hour = Number(hora?.split(":")[0]);
    const minutes = Number(hora?.split(":")[1]);

    return {
      moneda: "Dolar",
      tipo,
      venta,
      compra,
      fecha: new Date(year, month, day, hour, minutes),
      EntidadId: id,
    };
  } catch (error) {
    return new Error(`No se pudo obtener la cotizacion de Ambito - ${tipo}`);
  }
}

async function createCotizacion(
  cotizacion: Cotizacion | Error,
  tipo: TIPOS,
  id: number
): Promise<Boolean> {
  try {
    if (cotizacion instanceof Error) {
      await ErrorService.createError({
        mensaje: cotizacion.message,
        file: "ambito.ts",
        tipo,
        moneda: "Dolar",
        EntidadId: id,
      });
      return false;
    } else {
      const createCotizacion = await CotizacionService.createCotizacion(
        cotizacion
      );
      if (createCotizacion instanceof Error) {
        await ErrorService.createError({
          mensaje: createCotizacion.message,
          file: "ambito.ts",
          tipo,
          moneda: "Dolar",
          EntidadId: id,
        });
        return false;
      }
    }
    return true;
  } catch (error) {
    return false;
  }
}
