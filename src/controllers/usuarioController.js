const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
    try {
        const { nome, email, senha, tipo } = req.body;

        // Validar se todos os campos foram enviados
        if (!nome || !email || !senha || !tipo) {
            return res.status(400).json({ erro: "Todos os campos (nome, email, senha, tipo) são obrigatórios" });
        }

        // Validar tipo
        if (!['cliente', 'farmacia'].includes(tipo)) {
            return res.status(400).json({ erro: "O tipo deve ser 'cliente' ou 'farmacia'" });
        }

        // Verificar se o email já existe
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ erro: "E-mail já cadastrado" });
        }

        // Criptografar senha
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        // Criar usuário
        const usuario = await Usuario.create({
            nome,
            email,
            senha: senhaCriptografada,
            tipo
        });

        // Retornar dados básicos (sem senha)
        const usuarioResponse = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipo: usuario.tipo
        };

        res.status(201).json({
            mensagem: "Cadastro realizado com sucesso",
            usuario: usuarioResponse
        });
    } catch (error) {
        res.status(500).json({ erro: "Erro ao realizar cadastro", detalhes: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: "E-mail e senha são obrigatórios" });
        }

        // Buscar usuário
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ erro: "Usuário não encontrado" });
        }

        // Validar senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: "Senha incorreta" });
        }

        // Retorno de dados do usuário
        res.status(200).json({
            id: usuario.id,
            nome: usuario.nome,
            tipo: usuario.tipo
        });
    } catch (error) {
        res.status(500).json({ erro: "Erro ao realizar login", detalhes: error.message });
    }
};

exports.listarUsuarios = async (req, res) => {
    const usuarios = await Usuario.findAll({
        attributes: ['id', 'nome', 'email', 'tipo']
    });
    res.json(usuarios);
};

// Mantendo o nome antigo para compatibilidade se necessário, mas redirecionando ou avisando
exports.criarUsuario = exports.register;