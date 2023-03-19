import { Sequelize } from "sequelize";

const connection = new Sequelize("dolar", "postgres", "admin", {
  host: "localhost",
  dialect: "postgres",
});

export default connection;
