import Entidad from "../models/entidad";

const EntidadService = {
  getEntidades: async () => {
    try {
      const entidades = await Entidad.findAll();
      return entidades;
    } catch (error) {
      return new Error("No existen entidades");
    }
  },
  getEntidad: async (id: number) => {
    try {
      const entidad = await Entidad.findByPk(id);
      if (!entidad) {
        return new Error(`No existe una entidad con el id ${id}`);
      }
      return entidad;
    } catch (error) {
      return new Error(`No existe una entidad con el id ${id}`);
    }
  },
  getEntidadByNombre: async (nombre: string) => {
    try {
      const entidad = await Entidad.findOne({
        where: {
          nombre,
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
      const existeEntidad = await Entidad.findOne({
        where: {
          nombre: body.nombre,
        },
      });
      if (existeEntidad) {
        return new Error(`Ya existe una entidad con el nombre ${body.nombre}`);
      }
      const entidad = Entidad.build(body);
      await entidad.save();
      return entidad;
    } catch (error: any) {
      return new Error(error);
    }
  },
  updateEntidad: async (id: number, body: any) => {
    try {
      const entidad = await Entidad.findByPk(id);
      if (!entidad) {
        return new Error(`No existe una entidad con el id ${id}`);
      }
      await entidad.update(body);
      return entidad;
    } catch (error: any) {
      return new Error(error);
    }
  },
  deleteEntidad: async (id: number) => {
    try {
      const entidad = await Entidad.findByPk(id);
      if (!entidad) {
        return new Error(`No existe una entidad con el id ${id}`);
      }
      await Entidad.update({ activo: false }, { where: { id } });
      return entidad;
    } catch (error: any) {
      return new Error(error);
    }
  },
};

export default EntidadService;
