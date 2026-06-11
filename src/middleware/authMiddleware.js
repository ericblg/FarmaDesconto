import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "faculdade-secret-key";

export const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(403).json({ erro: "Nenhum token fornecido" });
    }

    try {
        const tokenLimpo = token.replace('Bearer ', '');
        const decoded = jwt.verify(tokenLimpo, secret);
        req.usuario = decoded; // Salva o payload do token na requisição
        next();
    } catch (err) {
        return res.status(401).json({ erro: "Não autorizado" });
    }
};
