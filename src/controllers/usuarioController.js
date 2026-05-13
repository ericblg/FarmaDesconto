import Usuario from "../models/usuario.js";

export const register = async (req, res) => {
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

        // Criar usuário (sem criptografia)
        const usuario = await Usuario.create({
            nome,
            email,
            senha, // Senha em texto puro
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

export const login = async (req, res) => {
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

        // Validar senha (texto puro)
        if (senha !== usuario.senha) {
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

export const listarUsuarios = async (req, res) => {
    const usuarios = await Usuario.findAll({
        attributes: ['id', 'nome', 'email', 'tipo']
    });
    res.json(usuarios);
};

export const criarUsuario = register;