require("dotenv/config");
const bcrypt = require("bcrypt");
const prisma = require("../src/databases/prisma");

const DIA = 24 * 60 * 60 * 1000;

const veiculos = [
    { marca: "Fiat", modelo: "Argo", placa: "QWE1A23", ano: 2022, valorDiaria: 120 },
    { marca: "Volkswagen", modelo: "Polo", placa: "RTY2B34", ano: 2023, valorDiaria: 150 },
    { marca: "Chevrolet", modelo: "Onix", placa: "UIO3C45", ano: 2024, valorDiaria: 140 },
    { marca: "Toyota", modelo: "Corolla", placa: "PAS4D56", ano: 2023, valorDiaria: 260 },
    { marca: "Hyundai", modelo: "Creta", placa: "DFG5E67", ano: 2024, valorDiaria: 230 },
    { marca: "Jeep", modelo: "Compass", placa: "HJK6F78", ano: 2022, valorDiaria: 310 }
];

async function main() {
    await prisma.locacao.deleteMany();
    await prisma.veiculo.deleteMany();
    await prisma.usuario.deleteMany();

    const senha = await bcrypt.hash("123456", 10);

    const ana = await prisma.usuario.create({
        data: { nome: "Ana Souza", email: "ana@locadora.com", senha }
    });
    const bruno = await prisma.usuario.create({
        data: { nome: "Bruno Lima", email: "bruno@locadora.com", senha }
    });

    await prisma.veiculo.createMany({ data: veiculos });
    const [argo, polo, , corolla] = await prisma.veiculo.findMany({ orderBy: { id: "asc" } });

    const agora = Date.now();

    await prisma.locacao.create({
        data: {
            usuarioId: ana.id,
            veiculoId: argo.id,
            dataInicio: new Date(agora - 10 * DIA),
            dataPrevistaDevolucao: new Date(agora - 7 * DIA),
            dataDevolucao: new Date(agora - 7 * DIA),
            valorTotal: 360,
            status: "FINALIZADA"
        }
    });

    await prisma.$transaction([
        prisma.locacao.create({
            data: {
                usuarioId: ana.id,
                veiculoId: polo.id,
                dataInicio: new Date(agora - DIA),
                dataPrevistaDevolucao: new Date(agora + 2 * DIA),
                valorTotal: 450
            }
        }),
        prisma.veiculo.update({ where: { id: polo.id }, data: { disponivel: false } })
    ]);

    await prisma.$transaction([
        prisma.locacao.create({
            data: {
                usuarioId: bruno.id,
                veiculoId: corolla.id,
                dataInicio: new Date(agora),
                dataPrevistaDevolucao: new Date(agora + 4 * DIA),
                valorTotal: 1040
            }
        }),
        prisma.veiculo.update({ where: { id: corolla.id }, data: { disponivel: false } })
    ]);

    console.log("Seed concluído: 2 usuários, 6 veículos e 3 locações.");
}

main()
    .catch((erro) => {
        console.error(erro);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
