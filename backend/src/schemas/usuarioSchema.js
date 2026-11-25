const z = require("zod");

const usuarioSchema = z.object({
    nome: z.string("Nome é obrigatório").trim().min(3, "Nome muito curto"),
    email: z.string("E-mail é obrigatório").trim().toLowerCase().email("E-mail inválido"),
    senha: z.string("Senha é obrigatória").min(6, "A senha deve ter pelo menos 6 caracteres")
});

module.exports = usuarioSchema;
