const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING,
  },
  preco: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  data_validade: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  quantidade: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  farmacia_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "farmacias",
      key: "id"
    }
  }
}, {
  tableName: "produtos",
  timestamps: false
});

module.exports = Product;