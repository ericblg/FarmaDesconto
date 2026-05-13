import express from "express";
const router = express.Router();

import * as usuarioController from "../controllers/usuarioController.js";

router.post("/register", usuarioController.register);
router.post("/login", usuarioController.login);
router.get("/", usuarioController.listarUsuarios);

export default router;