const express = require("express");
const router = express.Router();


const farmaciaController = require("../controllers/farmaciaController");

// rota POST
router.post("/", farmaciaController.cadastrar);
router.get("/", farmaciaController.listar);

module.exports = router; 