import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./src/database.sqlite",
  logging: false, // opcional (não poluir o console)
});

export default sequelize;