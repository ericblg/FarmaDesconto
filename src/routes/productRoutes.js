import express from "express";
const router = express.Router();
import * as controller from "../controllers/productController.js";

router.post("/", controller.createProduct);
router.get("/", controller.getProducts);
router.get("/vencendo", controller.getExpiringProducts);

export default router;