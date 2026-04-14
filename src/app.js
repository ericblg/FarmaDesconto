const express = require("express");
const sequelize = require("./config/database");
const productRoutes = require("./routes/productRoutes");
const farmaciaRoutes = require("./routes/farmaciaRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");


const app = express();
app.use(express.json());

// http://localhost:3000/farmacias 
app.use("/farmacias", farmaciaRoutes);
app.use("/produtos", productRoutes);
app.use("/usuarios", usuarioRoutes);

console.log("usuarioRoutes:", usuarioRoutes);

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
  });
}).catch((err) => {
  console.error("Erro ao conectar com o banco de dados:", err);
});