const prisma = require("../databases/prisma");
const NaoEncontradoError = require("../errors/NaoEncontradoError");
const RequisicaoInvalidaError = require("../errors/RequisicaoInvalidaError");
const VeiculoIndisponivelError = require("../errors/VeiculoIndisponivelError");
const LocacaoJaFinalizadaError = require("../errors/LocacaoJaFinalizadaError");
const AcessoNegadoError = require("../errors/AcessoNegadoError");

const UM_DIA_EM_MS = 24 * 60 * 60 * 1000;

const dadosDoVeiculo = {
    select: {
        id: true,
        marca: true,
        modelo: true,
        placa: true,
        ano: true,
        valorDiaria: true
    }
};

class LocacaoService{
    validarDatas(dataInicio, dataPrevistaDevolucao){
        const inicioDoDia = new Date();
        inicioDoDia.setHours(0, 0, 0, 0);

        if(dataInicio < inicioDoDia){
            throw new RequisicaoInvalidaError("A data de início não pode estar no passado");
        }

        if(dataPrevistaDevolucao <= dataInicio){
            throw new RequisicaoInvalidaError("A data prevista de devolução deve ser posterior à data de início");
        }
    }

    calcularValorTotal(valorDiaria, dataInicio, dataPrevistaDevolucao){
        const duracaoEmMs = dataPrevistaDevolucao.getTime() - dataInicio.getTime();
        const quantidadeDiarias = Math.ceil(duracaoEmMs / UM_DIA_EM_MS);
        return valorDiaria.mul(quantidadeDiarias);
    }

    async create(usuarioId, {veiculoId, dataInicio, dataPrevistaDevolucao}){
        this.validarDatas(dataInicio, dataPrevistaDevolucao);

        const veiculo = await prisma.veiculo.findUnique({
            where: {id: veiculoId}
        });

        if(!veiculo){
            throw new NaoEncontradoError("Veículo não encontrado");
        }

        if(!veiculo.disponivel){
            throw new VeiculoIndisponivelError();
        }

        const valorTotal = this.calcularValorTotal(veiculo.valorDiaria, dataInicio, dataPrevistaDevolucao);

        const novaLocacao = await prisma.$transaction(async (tx) => {
            const {count} = await tx.veiculo.updateMany({
                where: {id: veiculoId, disponivel: true},
                data: {disponivel: false}
            });

            if(count === 0){
                throw new VeiculoIndisponivelError();
            }

            return tx.locacao.create({
                data: {
                    usuarioId,
                    veiculoId,
                    dataInicio,
                    dataPrevistaDevolucao,
                    valorTotal
                },
                include: {veiculo: dadosDoVeiculo}
            });
        });

        return novaLocacao;
    }

    async findMany(usuarioId){
        const locacoes = await prisma.locacao.findMany({
            where: {usuarioId},
            include: {veiculo: dadosDoVeiculo},
            orderBy: [{status: "asc"}, {dataInicio: "desc"}]
        });
        return locacoes;
    }

    async findById(usuarioId, id){
        const locacao = await prisma.locacao.findUnique({
            where: {id},
            include: {veiculo: dadosDoVeiculo}
        });

        if(!locacao){
            throw new NaoEncontradoError("Locação não encontrada");
        }

        if(locacao.usuarioId !== usuarioId){
            throw new AcessoNegadoError();
        }

        return locacao;
    }

    async finalizar(usuarioId, id){
        const locacao = await this.findById(usuarioId, id);

        if(locacao.status === "FINALIZADA"){
            throw new LocacaoJaFinalizadaError();
        }

        const locacaoFinalizada = await prisma.$transaction(async (tx) => {
            const {count} = await tx.locacao.updateMany({
                where: {id, status: "ATIVA"},
                data: {
                    status: "FINALIZADA",
                    dataDevolucao: new Date()
                }
            });

            if(count === 0){
                throw new LocacaoJaFinalizadaError();
            }

            await tx.veiculo.update({
                where: {id: locacao.veiculoId},
                data: {disponivel: true}
            });

            return tx.locacao.findUnique({
                where: {id},
                include: {veiculo: dadosDoVeiculo}
            });
        });

        return locacaoFinalizada;
    }
}

module.exports = new LocacaoService();
