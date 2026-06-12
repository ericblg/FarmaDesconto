import Solicitacao from "../models/solicitacaoModel.js";
import Product from "../models/Product.js";
import Usuario from "../models/usuario.js";

// Criar Solicitação
export const criarSolicitacao = async (req, res) => {
  const { produto_id, quantidade } = req.body;

  if (!produto_id) {
    return res.status(400).json({ erro: "Produto é obrigatório" });
  }

  try {
    const produto = await Product.findByPk(produto_id);
    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    // Criar a solicitação
    const solicitacao = await Solicitacao.create({
      produto_id,
      cliente_id: req.usuario.id,
      farmacia_id: produto.farmacia_id, // Farmácia dona do produto
      quantidade: quantidade || 1,
      status: "Pendente"
    });

    res.status(201).json({
      mensagem: "Solicitação enviada com sucesso!",
      solicitacao
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar solicitação", detalhes: err.message });
  }
};

// Listar Solicitações
export const listarSolicitacoes = async (req, res) => {
  try {
    const where = {};
    if (req.usuario.tipo === "farmacia") {
      where.farmacia_id = req.usuario.id;
    } else {
      where.cliente_id = req.usuario.id;
    }

    const solicitacoes = await Solicitacao.findAll({
      where,
      include: [
        { model: Product, as: "produto", attributes: ["nome", "descricao"] },
        { model: Usuario, as: "cliente", attributes: ["nome", "email"] }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json(solicitacoes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar solicitações", detalhes: err.message });
  }
};

// Atualizar Status (apenas farmácia)
export const atualizarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Pendente, Aprovado, Concluído

    const solicitacao = await Solicitacao.findByPk(id);
    if (!solicitacao) return res.status(404).json({ erro: "Solicitação não encontrada" });

    // Verifica permissão (apenas a farmácia dona)
    if (req.usuario.tipo !== "farmacia" || solicitacao.farmacia_id !== req.usuario.id) {
      return res.status(403).json({ erro: "Sem permissão para alterar esta solicitação" });
    }

    await solicitacao.update({ status });

    res.json({ mensagem: "Status atualizado", solicitacao });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar solicitação", detalhes: err.message });
  }
};
