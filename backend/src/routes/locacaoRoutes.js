const express = require("express");
const locacaoController = require("../controllers/LocacaoController");
const authMiddleware = require("../middlewares/authMiddleware");
const validarSchema = require("../middlewares/validarSchema");
const locacaoSchema = require("../schemas/locacaoSchema");

const router = express.Router();

router.use(authMiddleware);

router.post("/", validarSchema(locacaoSchema), locacaoController.create);
router.get("/", locacaoController.findMany);
router.get("/:id", locacaoController.findById);
router.patch("/:id/finalizar", locacaoController.finalizar);

module.exports = router;
