import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Solicitacao = db.define("Solicitacao", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  produto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  farmacia_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Pendente", // Pendente, Aprovado, Concluído
  },
}, {
  timestamps: true, // creates createdAt
});

export default Solicitacao;
