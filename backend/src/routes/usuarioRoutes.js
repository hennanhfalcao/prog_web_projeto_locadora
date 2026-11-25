const express = require("express");
const usuarioController = require("../controllers/UsuarioController");
const validarSchema = require("../middlewares/validarSchema");
const authMiddleware = require("../middlewares/authMiddleware");
const usuarioSchema = require("../schemas/usuarioSchema");

const router = express.Router();

router.post("/", validarSchema(usuarioSchema), usuarioController.create);
router.get("/me", authMiddleware, usuarioController.me);

module.exports = router;
