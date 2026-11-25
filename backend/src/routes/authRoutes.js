const {Router} = require("express");
const authController = require("../controllers/AuthController");
const validarSchema = require("../middlewares/validarSchema");
const loginSchema = require("../schemas/loginSchema");

const router = Router();

router.post("/login", validarSchema(loginSchema), authController.login);

module.exports = router;
