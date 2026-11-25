const express = require("express");
const veiculoController = require("../controllers/VeiculoController");
const authMiddleware = require("../middlewares/authMiddleware");
const validarSchema = require("../middlewares/validarSchema");
const veiculoSchema = require("../schemas/veiculoSchema");

const router = express.Router();

router.use(authMiddleware);

router.get("/", veiculoController.findMany);
router.get("/:id", veiculoController.findById);
router.post("/", validarSchema(veiculoSchema), veiculoController.create);

module.exports = router;
