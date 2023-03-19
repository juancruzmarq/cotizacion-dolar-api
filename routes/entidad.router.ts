import { Router } from "express";
import {
  createCotizacion,
  getCotizacion,
  getCotizaciones,
} from "../controllers/cotizacion";
import {
  createEntidad,
  deleteEntidad,
  getEntidad,
  getEntidades,
  updateEntidad,
} from "../controllers/entidad";

const router = Router();

// Rutas de la entidad
router.get("/", getEntidades);
router.get("/:id", getEntidad);
router.post("/", createEntidad);
router.post("/:id", updateEntidad);
router.delete("/:id", deleteEntidad);

export default router;