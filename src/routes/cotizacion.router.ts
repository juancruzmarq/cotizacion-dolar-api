import { Router } from "express";
import {
  createCotizacion,
  getArbolCotizaciones,
  getCotizacion,
  getCotizacionByEntidad,
  getCotizaciones,
} from "../controllers/cotizacion";

const router = Router();

// Rutas de la cotizacion
router.get("/entidad/:id", getCotizacionByEntidad);
router.get("/dolar", getArbolCotizaciones);
router.get("/:id", getCotizacion);
router.get("/", getCotizaciones);
router.post("/", createCotizacion);

export default router;
