const Usuario = require("../models/usuario");

exports.criarUsuario = async (req, res) => {
    const { nome, tipo } = req.body;

    if (!nome || !tipo) {
        return res.status(400).json({ erro: "Nome e tipo são obrigatórios" });
    }

    const usuario = await Usuario.create({ nome, tipo });

    res.status(201).json({
        mensagem: "Usuário criado com sucesso",
        usuario
    });
};

exports.listarUsuarios = async (req, res) => {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
};