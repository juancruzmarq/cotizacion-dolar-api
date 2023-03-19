import { Entidad } from "@prisma/client";
import prisma from "../database/connection";
import { ErrorService } from "./error.service";

interface Cotizacion {
  moneda: string;
  tipo: string;
  fecha: Date;
  compra?: number | null;
  venta: number;
}

interface EntidadesCotizaciones {
  [key: string]: {
    url: string;
    es_banco: boolean;
    cotizaciones: Cotizacion[];
  };
}

const CotizacionService = {
  getCotizaciones: async () => {
    try {
      const cotizaciones = await prisma.cotizacion.findMany();
      if (cotizaciones.length === 0) {
        return new Error("No existen cotizaciones");
      }
      return cotizaciones;
    } catch (error) {
      return new Error("No existen cotizaciones");
    }
  },
  getCotizacion: async (id: number) => {
    try {
      const cotizacion = await prisma.cotizacion.findUnique({
        where: {
          id: id,
        },
      });
      if (!cotizacion) {
        return new Error(`No existe una cotizacion con el id ${id}`);
      }
      return cotizacion;
    } catch (error) {
      return new Error(`No existe una cotizacion con el id ${id}`);
    }
  },
  createCotizacion: async (body: any) => {
    try {
      const cotizacion = await prisma.cotizacion.create({
        data: {
          moneda: body.moneda,
          tipo: body.tipo,
          compra: body.compra,
          venta: body.venta,
          fecha: body.fecha,
          EntidadId: body.EntidadId,
        },
      });
      return cotizacion;
    } catch (error: any) {
      return new Error(error);
    }
  },
  getLastCotizacionByEntidad: async (id: number) => {
    try {
      const cotizacion = await prisma.cotizacion.findFirst({
        where: {
          EntidadId: id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      if (!cotizacion) {
        console.log("No existe una cotizacion para la entidad con el id " + id);
        return new Error(`No existe una cotizacion con el id ${id}`);
      }
      return cotizacion;
    } catch (error: any) {
      return new Error(error);
    }
  },
  getCotizacionByEntidad: async (id: number) => {
    try {
      const cotizacion = await prisma.cotizacion.findMany({
        where: {
          EntidadId: id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      if (cotizacion.length === 0) {
        console.log("No existe una cotizacion para la entidad con el id " + id);
        return new Error(
          `No existe una cotizacion para la entidad con el id ${id}`
        );
      }
      return cotizacion;
    } catch (error: any) {
      return new Error(error);
    }
  },
  getArbolCotizaciones: async () => {
    try {
      const cotizaciones = await prisma.cotizacion.findMany({
        include: { Entidad: true },
        orderBy: { fecha: "desc" },
        distinct: ["EntidadId", "tipo"],
      });
      const arbolCotizaciones: EntidadesCotizaciones = {};

      for (const cotizacion of cotizaciones) {
        const entidad = cotizacion.Entidad?.nombre;
        if (!entidad) {
          return new Error("No existen cotizaciones");
        }
        if (!arbolCotizaciones[entidad]) {
          arbolCotizaciones[entidad] = {
            url: cotizacion.Entidad?.url || "",
            es_banco: cotizacion.Entidad?.es_banco || false,
            cotizaciones: [],
          };
        }

        arbolCotizaciones[entidad].cotizaciones.push({
          moneda: cotizacion.moneda,
          tipo: cotizacion.tipo,
          fecha: cotizacion.fecha,
          compra: cotizacion.compra,
          venta: cotizacion.venta,
        });
      }

      return arbolCotizaciones;
    } catch (error) {
      console.log(error);
      return new Error("No existen cotizaciones");
    }
  },
};

export default CotizacionService;
