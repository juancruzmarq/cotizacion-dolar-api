import express, { Application } from "express";
import entidadesRouter from "../routes/entidad.router";
import cotizacionesRouter from "../routes/cotizacion.router";
import cors from "cors";
import connection from "../database/connection";
import Entidad from "./entidad";
import Cotizacion from "./cotizacion";
import { scrapping } from "../scrapping/scrapping";

class Server {
  private app: Application;
  private port: number;
  private apiPaths = {
    entidades: "/api/entidades",
    cotizaciones: "/api/cotizaciones",
  };

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 3000;

    // Database
    this.database();

    // Middlewares
    this.middleware();

    // Routes
    this.routes();

    // Scrapping
    this.scrap();
  }

  middleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  async database() {
    try {
      await Entidad.sync();
      await Cotizacion.sync();
      await connection.authenticate();
      console.log("Database online");
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async scrap() {
    await scrapping();
  }

  routes() {
    this.app.use(this.apiPaths.entidades, entidadesRouter);
    this.app.use(this.apiPaths.cotizaciones, cotizacionesRouter);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

export default Server;
