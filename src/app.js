const express = require("express");
const sequelize = require("./config/database");
const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(express.json());

app.use("/produtos", productRoutes);

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
  });
});