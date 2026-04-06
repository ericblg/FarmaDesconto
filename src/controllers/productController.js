const Product = require("../models/Product");
const { Op } = require("sequelize");

// Criar produto
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar todos
exports.getProducts = async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
};

// Filtro: próximos do vencimento (ex: 7 dias)
exports.getExpiringProducts = async (req, res) => {
  const hoje = new Date();
  const limite = new Date();
  limite.setDate(hoje.getDate() + 7);

  const products = await Product.findAll({
    where: {
      data_validade: {
        [Op.between]: [hoje, limite],
      },
    },
  });

  res.json(products);
};