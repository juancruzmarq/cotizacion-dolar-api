import { Request, Response } from "express";
import EntidadService from "../services/entidad.service";

const getEntidades = async (req: Request, res: Response) => {
  const entidades = await EntidadService.getEntidades();
  if (entidades instanceof Error) {
    return res.status(404).json({
      msg: entidades.message,
    });
  }
  res.json(entidades);
};

const getEntidad = async (req: Request, res: Response) => {
  const { id } = req.params;
  const entidad = await EntidadService.getEntidad(Number(id));
  if (entidad instanceof Error) {
    return res.status(404).json({
      msg: entidad.message,
    });
  }
  res.json(entidad);
};

const createEntidad = async (req: Request, res: Response) => {
  const { body } = req;
  const entidad = await EntidadService.createEntidad(body);
  if (entidad instanceof Error) {
    return res.status(400).json({
      msg: entidad.message,
    });
  }
  res.json(entidad);
};

const updateEntidad = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { body } = req;
  const entidad = await EntidadService.updateEntidad(Number(id), body);
  if (entidad instanceof Error) {
    return res.status(400).json({
      msg: entidad.message,
    });
  }
  res.json(entidad);
};

const deleteEntidad = async (req: Request, res: Response) => {
  const { id } = req.params;
  const entidad = await EntidadService.deleteEntidad(Number(id));
  if (entidad instanceof Error) {
    return res.status(404).json({
      msg: entidad.message,
    });
  }
  res.json(entidad);
};

export {
  getEntidades,
  getEntidad,
  createEntidad,
  updateEntidad,
  deleteEntidad,
};
