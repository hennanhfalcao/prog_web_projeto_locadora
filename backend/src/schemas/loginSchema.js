const z = require("zod");

const loginSchema = z.object({
    email: z.string("E-mail é obrigatório").trim().toLowerCase().email("E-mail inválido"),
    senha: z.string("Senha é obrigatória").min(1, "Senha é obrigatória")
});

module.exports = loginSchema;
