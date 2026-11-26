const veiculoService = require("../services/VeiculoService");
const RequisicaoInvalidaError = require("../errors/RequisicaoInvalidaError");
const responderErro = require("../utils/responderErro");
const converterId = require("../utils/converterId");

class VeiculoController{
    async findMany(request, response){
        try{
            const {disponivel} = request.query;

            if(disponivel !== undefined && disponivel !== "true" && disponivel !== "false"){
                throw new RequisicaoInvalidaError("O filtro disponivel deve ser true ou false");
            }

            const veiculos = await veiculoService.findMany({
                disponivel: disponivel === undefined ? undefined : disponivel === "true"
            });
            return response.status(200).json({veiculos});
        }catch(err){
            return responderErro(response, err);
        }
    }

    async findById(request, response){
        try{
            const id = converterId(request.params.id, "Id do veículo inválido");
            const veiculo = await veiculoService.findById(id);
            return response.status(200).json({veiculo});
        }catch(err){
            return responderErro(response, err);
        }
    }

    async create(request, response){
        try{
            const veiculo = await veiculoService.create(request.body);
            return response.status(201).json({veiculo});
        }catch(err){
            return responderErro(response, err);
        }
    }
}

module.exports = new VeiculoController();
