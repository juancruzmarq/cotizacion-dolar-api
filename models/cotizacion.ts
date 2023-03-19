import { DataTypes } from "sequelize";
import connection from "../database/connection";
import Entidad from "./entidad";

const Cotizacion = connection.define(
  "Cotizacion",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    moneda: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    compra: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    venta: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "Cotizacion",
  }
);

export default Cotizacion;
