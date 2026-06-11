import express from "express";
const router = express.Router();
import * as controller from "../controllers/productController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

// Rotas públicas
router.get("/", controller.getProducts);
router.get("/vencendo", controller.getExpiringProducts);
router.get("/:id", controller.getProductById);

// Rotas protegidas
router.post("/", verifyToken, controller.createProduct);
router.put("/:id", verifyToken, controller.updateProduct);
router.delete("/:id", verifyToken, controller.deleteProduct);

export default router;