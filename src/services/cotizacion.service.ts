import prisma from "../database/connection";
import { ErrorService } from "./error.service";

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
};

export default CotizacionService;
