import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./config/database.js";
import productRoutes from "./routes/productRoutes.js";
import farmaciaRoutes from "./routes/farmaciaRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import solicitacaoRoutes from "./routes/solicitacaoRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Rotas da API
app.use("/farmacias", farmaciaRoutes);
app.use("/produtos", productRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/solicitacoes", solicitacaoRoutes);

// Servir os arquivos estáticos do React (quando buildado com npm run build)
app.use(express.static(path.join(__dirname, "../dist")));

// Qualquer rota não reconhecida na API é redirecionada para o React
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

import Usuario from "./models/usuario.js";
import Farmacia from "./models/farmaciaModel.js";
import Product from "./models/Product.js";
import Solicitacao from "./models/solicitacaoModel.js";

// Associações
Solicitacao.belongsTo(Product, { foreignKey: "produto_id", as: "produto" });
Solicitacao.belongsTo(Usuario, { foreignKey: "cliente_id", as: "cliente" });
Solicitacao.belongsTo(Farmacia, { foreignKey: "farmacia_id", as: "farmacia" });
Product.hasMany(Solicitacao, { foreignKey: "produto_id" });
Usuario.hasMany(Solicitacao, { foreignKey: "cliente_id" });
Farmacia.hasMany(Solicitacao, { foreignKey: "farmacia_id" });
Product.belongsTo(Farmacia, { foreignKey: "farmacia_id", as: "farmacia" });
Farmacia.hasMany(Product, { foreignKey: "farmacia_id" });

sequelize.sync().then(async () => {
  try {
    const usuarioCount = await Usuario.count();
    let user;
    if (usuarioCount === 0) {
      user = await Usuario.create({
        nome: "Apresentação",
        email: "teste@teste.com",
        senha: "123",
        tipo: "farmacia"
      });
    } else {
      user = await Usuario.findOne();
    }

    const farmaciaCount = await Farmacia.count();
    if (farmaciaCount === 0) {
      await Farmacia.create({
        nome: "Farmácia Central",
        endereco: "Rua Principal, 100",
        telefone: "11999999999",
        usuario_id: user.id
      });
      console.log("Farmácia inicial (seed) criada com sucesso.");
    }
  } catch (e) {
    console.error("Erro ao criar seed:", e);
  }

  app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
  });
}).catch((err) => {
  console.error("Erro ao conectar com o banco de dados:", err);
});