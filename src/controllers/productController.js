import Product from "../models/Product.js";
import Farmacia from "../models/farmaciaModel.js";
import { Op } from "sequelize";

// Criar produto
export const createProduct = async (req, res) => {
  const { nome, preco, data_validade, farmacia_id, descricao, quantidade } = req.body;

  // 1. Validar campos obrigatórios
  if (!nome || !preco || !data_validade || !farmacia_id) {
    return res.status(400).json({
      erro: "Os campos nome, preco, data_validade e farmacia_id são obrigatórios"
    });
  }

  try {
    // 2. Verificar se a farmácia existe
    const farmacia = await Farmacia.findByPk(farmacia_id);
    if (!farmacia) {
      return res.status(404).json({
        erro: "Farmácia não encontrada"
      });
    }

    // 3. Criar produto
    const product = await Product.create({
      nome,
      descricao,
      preco,
      data_validade,
      quantidade,
      farmacia_id
    });

    res.status(201).json({
      mensagem: "Produto cadastrado com sucesso",
      produto: product
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao cadastrar produto", detalhes: err.message });
  }
};

// Listar todos
export const getProducts = async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
};

// Filtro: próximos do vencimento (ex: 7 dias)
export const getExpiringProducts = async (req, res) => {
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