import express from "express";
const router = express.Router();
import * as controller from "../controllers/solicitacaoController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

// Todas as rotas de solicitação requerem login
router.use(verifyToken);

router.post("/", controller.criarSolicitacao);
router.get("/", controller.listarSolicitacoes);
router.put("/:id/status", controller.atualizarStatus);

export default router;
