import Product from "../models/Product.js";
import Farmacia from "../models/farmaciaModel.js";
import Usuario from "../models/usuario.js";
import { Op } from "sequelize";

// Criar produto
export const createProduct = async (req, res) => {
  const { nome, preco, data_validade, farmacia_id, categoria, descricao, quantidade } = req.body;

  if (!nome || preco === undefined || preco === null || !data_validade) {
    return res.status(400).json({
      erro: "Os campos nome, preco e data_validade são obrigatórios"
    });
  }

  try {
    const usuarioId = req.usuario ? req.usuario.id : farmacia_id;
    const usuario = await Usuario.findByPk(usuarioId);
    
    if (!usuario || usuario.tipo !== 'farmacia') {
      return res.status(404).json({
        erro: "Usuário não encontrado ou não é uma farmácia válida"
      });
    }

    // Busca a Farmácia real vinculada ao usuário, ou cria se não existir
    let farmacia = await Farmacia.findOne({ where: { usuario_id: usuarioId } });
    if (!farmacia) {
       farmacia = await Farmacia.create({
           nome: usuario.nome,
           usuario_id: usuario.id
       });
    }

    // Cria usando o ID real da Farmácia
    const product = await Product.create({
      nome,
      categoria,
      descricao,
      preco,
      data_validade,
      quantidade,
      farmacia_id: farmacia.id
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
  const products = await Product.findAll({
     include: [{ model: Farmacia, as: 'farmacia' }]
  });
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
    include: [{ model: Farmacia, as: 'farmacia' }]
  });

  res.json(products);
};

// Obter produto por ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, { include: [{ model: Farmacia, as: 'farmacia' }] });
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
    const { nome, categoria, descricao, preco, data_validade, quantidade } = req.body;
    
    const product = await Product.findByPk(id, { include: [{ model: Farmacia, as: 'farmacia' }] });
    if (!product) return res.status(404).json({ erro: "Produto não encontrado" });
    
    // Verifica permissão
    if (req.usuario && req.usuario.tipo === 'farmacia' && product.farmacia && product.farmacia.usuario_id !== req.usuario.id) {
       return res.status(403).json({ erro: "Você não tem permissão para editar este produto" });
    }

    await product.update({ nome, categoria, descricao, preco, data_validade, quantidade });
    res.json({ mensagem: "Produto atualizado com sucesso", produto: product });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar produto", detalhes: err.message });
  }
};

// Excluir produto
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, { include: [{ model: Farmacia, as: 'farmacia' }] });
    if (!product) return res.status(404).json({ erro: "Produto não encontrado" });

    // Verifica permissão
    if (req.usuario && req.usuario.tipo === 'farmacia' && product.farmacia && product.farmacia.usuario_id !== req.usuario.id) {
       return res.status(403).json({ erro: "Sem permissão" });
    }

    await product.destroy();
    res.json({ mensagem: "Produto excluído com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao excluir produto", detalhes: err.message });
  }
};