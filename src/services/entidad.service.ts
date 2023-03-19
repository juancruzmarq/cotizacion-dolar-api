import { Entidad } from "@prisma/client";
import prisma from "../database/connection";

const EntidadService = {
  getEntidades: async () => {
    try {
      const entidades = await prisma.entidad.findMany();
      if (entidades.length === 0) {
        return new Error("No existen entidades");
      }
      return entidades;
    } catch (error) {
      return new Error("No existen entidades");
    }
  },
  getEntidad: async (id: number) => {
    try {
      const entidad = await prisma.entidad.findUnique({
        where: {
          id: id,
        },
      });
      if (!entidad) {
        return new Error(`No existe una entidad con el id ${id}`);
      }
      return entidad;
    } catch (error) {
      return new Error(`No existe una entidad con el id ${id}`);
    }
  },
  getEntidadByNombre: async (nombre: string): Promise<Entidad | Error> => {
    try {
      const entidad = await prisma.entidad.findFirst({
        where: {
          nombre: nombre,
        },
      });
      if (!entidad) {
        return new Error(`No existe una entidad con el nombre ${nombre}`);
      }
      return entidad;
    } catch (error) {
      return new Error(`No existe una entidad con el nombre ${nombre}`);
    }
  },
  createEntidad: async (body: any) => {
    try {
      const existeEntidad = await prisma.entidad.findFirst({
        where: {
          nombre: body.nombre,
        },
      });
      if (existeEntidad) {
        return new Error(`Ya existe una entidad con el nombre ${body.nombre}`);
      }
      const entidad = await prisma.entidad.create({
        data: body,
      });
      return entidad;
    } catch (error: any) {
      return new Error(error);
    }
  },
  updateEntidad: async (id: number, body: any) => {
    try {
      const entidad = await prisma.entidad.findUnique({
        where: {
          id: id,
        },
      });
      if (!entidad) {
        return new Error(`No existe una entidad con el id ${id}`);
      }
      const entidadUpdated = await prisma.entidad.update({
        where: {
          id: id,
        },
        data: body,
      });
      return entidadUpdated;
    } catch (error: any) {
      return new Error(error);
    }
  },
  deleteEntidad: async (id: number) => {
    try {
      const entidad = await prisma.entidad.findUnique({
        where: {
          id: id,
        },
      });
      if (!entidad) {
        return new Error(`No existe una entidad con el id ${id}`);
      }
      const entidadDeleted = await prisma.entidad.update({
        where: {
          id: id,
        },
        data: {
          activo: false,
        },
      });
      return entidad;
    } catch (error: any) {
      return new Error(error);
    }
  },
};

export default EntidadService;
