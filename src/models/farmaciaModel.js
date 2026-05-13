import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

// Colocar no postman 
// {
//  "nome": "Farmácia Teste",
//  "endereco": "Rua A",
//  "telefone": "21999999999",
//  "usuario_id": 1
// }

const Farmacia = sequelize.define("Farmacia", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefone: {
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