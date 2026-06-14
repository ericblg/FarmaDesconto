import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

// Colocar no postman 
// {
//  "nome": "Farmácia Teste",
//  "usuario_id": 1
// }

const Farmacia = sequelize.define("Farmacia", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },

  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "usuarios",
      key: "id"
    }
  }
}, {
  tableName: "farmacias", 
  timestamps: false       
});

export default Farmacia;