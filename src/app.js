import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./config/database.js";
import productRoutes from "./routes/productRoutes.js";
import farmaciaRoutes from "./routes/farmaciaRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Rotas da API
app.use("/farmacias", farmaciaRoutes);
app.use("/produtos", productRoutes);
app.use("/usuarios", usuarioRoutes);

// Servir os arquivos estáticos do React (quando buildado com npm run build)
app.use(express.static(path.join(__dirname, "../dist")));

// Qualquer rota não reconhecida na API é redirecionada para o React
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
  });
}).catch((err) => {
  console.error("Erro ao conectar com o banco de dados:", err);
});