import { DataTypes, Model } from "sequelize";

import connection from "../database/connection";
import Cotizacion from "./cotizacion";

const Entidad = connection.define(
  "Entidad",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    es_banco: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
  },
  {
    tableName: "Entidad",
  }
);

Entidad.hasMany(Cotizacion);
Cotizacion.belongsTo(Entidad);

export default Entidad;
