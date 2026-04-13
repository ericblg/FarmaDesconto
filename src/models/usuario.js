const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

//  colocar no postman
//  {
//    "nome": "João",
//    "tipo": "farmacia"
//   }





const Usuario = sequelize.define("Usuario", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['cliente', 'farmacia']]
    }
  }
}, {
  tableName: "usuarios",
  timestamps: false
});

module.exports = Usuario;