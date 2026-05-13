import express from "express";
const router = express.Router();

import * as farmaciaController from "../controllers/farmaciaController.js";

// rota POST
router.post("/", farmaciaController.cadastrar);
router.get("/", farmaciaController.listar);

export default router;