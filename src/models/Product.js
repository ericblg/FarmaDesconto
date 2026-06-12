import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

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
    allowNull: false
  }
}, {
  tableName: "produtos",
  timestamps: false
});

export default Product;