const prisma = require("../databases/prisma");
const PlacaEmUsoError = require("../errors/PlacaEmUsoError");
const NaoEncontradoError = require("../errors/NaoEncontradoError");

class VeiculoService{
    async findMany({disponivel}){
        const veiculos = await prisma.veiculo.findMany({
            where: disponivel === undefined ? {} : {disponivel},
            orderBy: [{marca: "asc"}, {modelo: "asc"}]
        });
        return veiculos;
    }

    async findById(id){
        const veiculo = await prisma.veiculo.findUnique({
            where: {id}
        });

        if(!veiculo){
            throw new NaoEncontradoError("Veículo não encontrado");
        }

        return veiculo;
    }

    async create({marca, modelo, placa, ano, valorDiaria}){
        const existente = await prisma.veiculo.findUnique({
            where: {placa}
        });

        if(existente){
            throw new PlacaEmUsoError();
        }

        try{
            const novoVeiculo = await prisma.veiculo.create({
                data: {marca, modelo, placa, ano, valorDiaria}
            });
            return novoVeiculo;
        }catch(err){
            if(err.code === "P2002"){
                throw new PlacaEmUsoError();
            }
            throw err;
        }
    }
}

module.exports = new VeiculoService();
