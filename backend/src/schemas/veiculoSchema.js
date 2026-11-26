const z = require("zod");

const anoMaximo = new Date().getFullYear() + 1;

const veiculoSchema = z.object({
    marca: z.string("Marca é obrigatória").trim().min(2, "Marca muito curta").max(50, "Marca muito longa"),
    modelo: z.string("Modelo é obrigatório").trim().min(1, "Modelo é obrigatório").max(50, "Modelo muito longo"),
    placa: z.string("Placa é obrigatória")
        .trim()
        .toUpperCase()
        .transform((placa) => placa.replace("-", ""))
        .pipe(z.string().regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/, "Placa inválida. Use o formato ABC1234 ou ABC1D23")),
    ano: z.coerce.number("Ano é obrigatório")
        .int("Ano deve ser um número inteiro")
        .min(1950, "Ano inválido")
        .max(anoMaximo, `Ano não pode ser maior que ${anoMaximo}`),
    valorDiaria: z.coerce.number("Valor da diária é obrigatório")
        .positive("O valor da diária deve ser maior que zero")
        .max(99999999.99, "Valor da diária muito alto")
});

module.exports = veiculoSchema;
