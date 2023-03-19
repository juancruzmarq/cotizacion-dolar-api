import { Request, Response } from "express";
import Cotizacion from "../models/cotizacion";
import CotizacionService from "../services/cotizacion.service";

const getCotizaciones = async (req: Request, res: Response) => {
  const cotizaciones = await CotizacionService.getCotizaciones();
  if (cotizaciones instanceof Error) {
    return res.status(404).json({
      msg: cotizaciones.message,
    });
  }
  res.json(cotizaciones);
};

const getCotizacion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cotizacion = await CotizacionService.getCotizacion(Number(id));
  if (cotizacion instanceof Error) {
    return res.status(404).json({
      msg: cotizacion.message,
    });
  }
  res.json(cotizacion);
};

const getCotizacionByEntidad = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cotizacion = await CotizacionService.getCotizacionByEntidad(Number(id));
  if (cotizacion instanceof Error) {
    return res.status(404).json({
      msg: cotizacion.message,
    });
  }
  res.json(cotizacion);
};

const createCotizacion = async (req: Request, res: Response) => {
  const { body } = req;
  const cotizacion = await CotizacionService.createCotizacion(body);
  if (cotizacion instanceof Error) {
    return res.status(400).json({
      msg: cotizacion.message,
    });
  }
  res.json(cotizacion);
};

export {
  getCotizaciones,
  getCotizacion,
  getCotizacionByEntidad,
  createCotizacion,
};
