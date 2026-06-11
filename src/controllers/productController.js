import Product from "../models/Product.js";
import Farmacia from "../models/farmaciaModel.js";
import { Op } from "sequelize";

// Criar produto
export const createProduct = async (req, res) => {
  const { nome, preco, data_validade, farmacia_id, descricao, quantidade } = req.body;

  // 1. Validar campos obrigatórios
  if (!nome || preco === undefined || preco === null || !data_validade || !farmacia_id) {
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

// Obter produto por ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ erro: "Produto não encontrado" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar produto", detalhes: err.message });
  }
};

// Atualizar produto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, data_validade, quantidade } = req.body;
    
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ erro: "Produto não encontrado" });
    
    // Verifica permissão (apenas a própria farmácia pode editar)
    if (req.usuario && req.usuario.tipo === 'farmacia' && product.farmacia_id !== req.usuario.id) {
       return res.status(403).json({ erro: "Você não tem permissão para editar este produto" });
    }

    await product.update({ nome, descricao, preco, data_validade, quantidade });
    res.json({ mensagem: "Produto atualizado com sucesso", produto: product });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar produto", detalhes: err.message });
  }
};

// Excluir produto
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ erro: "Produto não encontrado" });

    // Verifica permissão
    if (req.usuario && req.usuario.tipo === 'farmacia' && product.farmacia_id !== req.usuario.id) {
       return res.status(403).json({ erro: "Sem permissão" });
    }

    await product.destroy();
    res.json({ mensagem: "Produto excluído com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao excluir produto", detalhes: err.message });
  }
};