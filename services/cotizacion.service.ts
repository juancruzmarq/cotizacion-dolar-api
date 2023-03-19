import Cotizacion from "../models/cotizacion";
import Entidad from "../models/entidad";

const CotizacionService = {
  getCotizaciones: async () => {
    try {
      const cotizaciones = await Cotizacion.findAll();
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
      const cotizacion = await Cotizacion.findByPk(id);
      if (!cotizacion) {
        return new Error(`No existe una cotizacion con el id ${id}`);
      }
      return cotizacion;
    } catch (error) {
      return new Error(`No existe una cotizacion con el id ${id}`);
    }
  },
  createCotizacion: async (body: any, entidadName?: string) => {
    try {
      if (entidadName) {
        const entidad = await Entidad.findOne({
          where: {
            nombre: entidadName,
          },
        });
        if (!entidad) {
          return new Error(`No existe una entidad con el nombre ${entidadName}`);
        }
        body.EntidadId = entidad.getDataValue("id");
      }
      const cotizacion = Cotizacion.build(body);
      await cotizacion.save();
      return cotizacion;
    } catch (error: any) {
      return new Error(error);
    }
  },
  getLastCotizacionByEntidad: async (id: number) => {
    try {
      const cotizacion = await Cotizacion.findOne({
        where: {
          entidadId: id,
        },
        order: [["createdAt", "DESC"]],
      });
      if (!cotizacion) {
        return new Error(`No existe una cotizacion con el id ${id}`);
      }
      return cotizacion;
    } catch (error: any) {
      return new Error(error);
    }
  },
  getCotizacionByEntidad: async (id: number) => {
    try {
      const cotizacion = await Cotizacion.findAll({
        where: {
          EntidadId: id,
        },
        order: [["createdAt", "DESC"]],
        limit: 1,
      });
      if (cotizacion.length === 0) {
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
