const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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
    allowNull: false
  }
}, {
  tableName: "farmacias", 
  timestamps: false       
});

module.exports = Farmacia;