const Farmacia = require("../models/farmaciaModel");
const Usuario = require("../models/usuario");


exports.cadastrar = async (req, res) => {
  const { nome, endereco, telefone, usuario_id } = req.body;

  if (!nome || !endereco || !telefone || !usuario_id) {
    return res.status(400).json({
      erro: "Todos os campos são obrigatórios"
    });
  }

  try {
    // 🔍 verificar se usuário existe
    const usuario = await Usuario.findByPk(usuario_id);

    if (!usuario) {
      return res.status(404).json({
        erro: "Usuário não encontrado"
      });
    }

    // 🔒 verificar tipo
    if (usuario.tipo !== "farmacia") {
      return res.status(403).json({
        erro: "Usuário não é do tipo farmácia"
      });
    }

    // 🚫 verificar cadastro duplicado (mesmo usuário cadastrando a mesma farmácia - opcional)
    const farmaciaExistente = await Farmacia.findOne({ 
      where: { usuario_id, nome } 
    });

    if (farmaciaExistente) {
      return res.status(400).json({
        erro: "Esta farmácia já está cadastrada para este usuário"
      });
    }

    // 💾 criar farmácia
    const novaFarmacia = await Farmacia.create({
      nome,
      endereco,
      telefone,
      usuario_id
    });

    res.status(201).json({
      mensagem: "Farmácia cadastrada com sucesso",
      farmacia: novaFarmacia
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      erro: "Erro ao cadastrar farmácia"
    });
  }
};


exports.listar = async (req, res) => {
  try {
    const farmacias = await Farmacia.findAll({
      attributes: ["id", "nome", "endereco", "telefone", "usuario_id"]
    });

    res.status(200).json(farmacias);

  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      erro: "Erro ao buscar farmácias"
    });
  }
};