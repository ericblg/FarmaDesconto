import Solicitacao from "../models/solicitacaoModel.js";
import Product from "../models/Product.js";
import Usuario from "../models/usuario.js";
import Farmacia from "../models/farmaciaModel.js";

// Criar Solicitação
export const criarSolicitacao = async (req, res) => {
  const { produto_id, quantidade } = req.body;
  const qtdSolicitada = Number(quantidade) || 1;

  if (!produto_id) {
    return res.status(400).json({ erro: "Produto é obrigatório" });
  }
  
  if (qtdSolicitada <= 0) {
    return res.status(400).json({ erro: "Quantidade deve ser maior que zero" });
  }

  try {
    const produto = await Product.findByPk(produto_id);
    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    if (produto.quantidade < qtdSolicitada) {
      return res.status(400).json({ erro: "Quantidade indisponível em estoque. Estoque atual: " + produto.quantidade });
    }

    // Criar a solicitação
    const solicitacao = await Solicitacao.create({
      produto_id,
      cliente_id: req.usuario.id,
      farmacia_id: produto.farmacia_id, // Farmácia dona do produto (id real da farmacia)
      quantidade: qtdSolicitada,
      status: "Pendente"
    });

    // Abater do estoque
    await produto.update({ quantidade: produto.quantidade - qtdSolicitada });

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
      const farmacia = await Farmacia.findOne({ where: { usuario_id: req.usuario.id } });
      if (!farmacia) {
          return res.json([]); // Se não tem farmácia real, não tem solicitações
      }
      where.farmacia_id = farmacia.id;
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
    if (req.usuario.tipo !== "farmacia") {
      return res.status(403).json({ erro: "Sem permissão" });
    }
    
    const farmacia = await Farmacia.findOne({ where: { usuario_id: req.usuario.id } });
    if (!farmacia || solicitacao.farmacia_id !== farmacia.id) {
      return res.status(403).json({ erro: "Sem permissão para alterar esta solicitação" });
    }

    await solicitacao.update({ status });

    res.json({ mensagem: "Status atualizado", solicitacao });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar solicitação", detalhes: err.message });
  }
};

// Atualizar Quantidade (apenas cliente, apenas Pendente)
export const atualizarSolicitacao = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantidade } = req.body;
    const novaQuantidade = Number(quantidade);

    if (novaQuantidade <= 0) {
      return res.status(400).json({ erro: "Quantidade deve ser maior que zero" });
    }

    const solicitacao = await Solicitacao.findByPk(id);
    if (!solicitacao) return res.status(404).json({ erro: "Solicitação não encontrada" });

    // Verifica permissão (apenas o próprio cliente pode editar)
    if (solicitacao.cliente_id !== req.usuario.id) {
      return res.status(403).json({ erro: "Sem permissão" });
    }

    // Regra: Só pode editar se estiver Pendente
    if (solicitacao.status !== "Pendente") {
      return res.status(400).json({ erro: "Não é possível editar uma solicitação que não esteja Pendente" });
    }

    const produto = await Product.findByPk(solicitacao.produto_id);
    if (!produto) return res.status(404).json({ erro: "Produto associado não encontrado" });

    const diferenca = novaQuantidade - solicitacao.quantidade;

    // Se estiver aumentando a quantidade, precisa verificar se tem estoque
    if (diferenca > 0 && produto.quantidade < diferenca) {
       return res.status(400).json({ erro: "Quantidade indisponível em estoque. Estoque extra disponível: " + produto.quantidade });
    }

    // Atualiza o estoque do produto (se diferença for negativa, ele soma; se positiva, subtrai)
    await produto.update({ quantidade: produto.quantidade - diferenca });
    
    // Atualiza a solicitação
    await solicitacao.update({ quantidade: novaQuantidade });

    res.json({ mensagem: "Solicitação atualizada com sucesso", solicitacao });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar solicitação", detalhes: err.message });
  }
};

// Excluir Solicitação (apenas cliente, apenas Pendente)
export const excluirSolicitacao = async (req, res) => {
  try {
    const { id } = req.params;

    const solicitacao = await Solicitacao.findByPk(id);
    if (!solicitacao) return res.status(404).json({ erro: "Solicitação não encontrada" });

    // Verifica permissão (apenas o próprio cliente pode excluir)
    if (solicitacao.cliente_id !== req.usuario.id) {
      return res.status(403).json({ erro: "Sem permissão" });
    }

    // Regra: Só pode excluir se estiver Pendente
    if (solicitacao.status !== "Pendente") {
      return res.status(400).json({ erro: "Não é possível excluir uma solicitação que já foi Aprovada ou Concluída" });
    }

    // Devolver a quantidade ao estoque do produto
    const produto = await Product.findByPk(solicitacao.produto_id);
    if (produto) {
      await produto.update({ quantidade: produto.quantidade + solicitacao.quantidade });
    }

    await solicitacao.destroy();

    res.json({ mensagem: "Solicitação cancelada e estoque devolvido com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao excluir solicitação", detalhes: err.message });
  }
};
