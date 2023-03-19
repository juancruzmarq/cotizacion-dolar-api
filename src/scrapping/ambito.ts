import { AMBITO, Cotizacion, TIPOS } from "../constants";
import { Browser, Page } from "playwright";
import CotizacionService from "../services/cotizacion.service";
import { ErrorService } from "../services/error.service";
import EntidadService from "../services/entidad.service";
import { Entidad } from "@prisma/client";

export async function createCotizacionAmbito(
  browser: Browser
): Promise<Boolean> {
  try {
    const page = await browser.newPage();
    await page.goto(AMBITO);

    const ambito = await EntidadService.getEntidadByNombre("Ambito");
    if (ambito instanceof Error) return false;

    const turista = await createCotizacionSoloVenta(
      await soloVenta(page, ambito.id, "/dolarturista", TIPOS.TURISTA),
      TIPOS.TURISTA,
      ambito.id
    );
    const ccl = await createCotizacionSoloVenta(
      await soloVenta(page, ambito.id, "/dolarrava/cl", TIPOS.CCL),
      TIPOS.CCL,
      ambito.id
    );
    const lujo = await createCotizacionSoloVenta(
      await soloVenta(page, ambito.id, "/dolardelujo", TIPOS.LUJO),
      TIPOS.LUJO,
      ambito.id
    );
    const mep = await createCotizacionSoloVenta(
      await soloVenta(page, ambito.id, "/dolarrava/mep", TIPOS.MEP),
      TIPOS.MEP,
      ambito.id
    );
    const ahorro = await createCotizacionSoloVenta(
      await soloVenta(page, ambito.id, "/dolarahorro", TIPOS.AHORRO),
      TIPOS.AHORRO,
      ambito.id
    );
    const qatar = await createCotizacionSoloVenta(
      await soloVenta(page, ambito.id, "/dolarqatar", TIPOS.QATAR),
      TIPOS.QATAR,
      ambito.id
    );
    const coldplay = await createCotizacionSoloVenta(
      await soloVenta(page, ambito.id, "/dolarcoldplay", TIPOS.COLDPLAY),
      TIPOS.COLDPLAY,
      ambito.id
    );

    return turista && ccl && lujo && mep && ahorro && qatar && coldplay;
  } catch (error) {
    return false;
  }
}

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

async function createCotizacionSoloVenta(
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
          tipo: TIPOS.TURISTA,
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
