import sequelize from "./src/config/database.js";
import Product from "./src/models/Product.js";
import Farmacia from "./src/models/farmaciaModel.js";
import Usuario from "./src/models/usuario.js";

// Sincroniza usando alter para não deletar os usuários criados
sequelize.sync({ force: true }).then(() => {
  console.log("Banco de dados sincronizado com sucesso, coluna de categoria adicionada!");
  process.exit();
}).catch(console.error);
