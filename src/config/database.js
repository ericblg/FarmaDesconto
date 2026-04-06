const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false, // opcional (não poluir o console)
});

module.exports = sequelize;