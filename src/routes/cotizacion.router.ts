import { Router } from "express";
import {
  createCotizacion,
  getCotizacion,
  getCotizacionByEntidad,
  getCotizaciones,
} from "../controllers/cotizacion";

const router = Router();

// Rutas de la cotizacion
router.get("/", getCotizaciones);
router.get("/:id", getCotizacion);
router.get("/entidad/:id", getCotizacionByEntidad);
router.post("/", createCotizacion);

export default router;
