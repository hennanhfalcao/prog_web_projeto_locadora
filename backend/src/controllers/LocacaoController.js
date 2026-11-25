const locacaoService = require("../services/LocacaoService");
const responderErro = require("../utils/responderErro");
const converterId = require("../utils/converterId");

class LocacaoController{
    async create(request, response){
        try{
            const locacao = await locacaoService.create(request.user.id, request.body);
            return response.status(201).json({locacao});
        }catch(err){
            return responderErro(response, err);
        }
    }

    async findMany(request, response){
        try{
            const locacoes = await locacaoService.findMany(request.user.id);
            return response.status(200).json({locacoes});
        }catch(err){
            return responderErro(response, err);
        }
    }

    async findById(request, response){
        try{
            const id = converterId(request.params.id, "Id da locação inválido");
            const locacao = await locacaoService.findById(request.user.id, id);
            return response.status(200).json({locacao});
        }catch(err){
            return responderErro(response, err);
        }
    }

    async finalizar(request, response){
        try{
            const id = converterId(request.params.id, "Id da locação inválido");
            const locacao = await locacaoService.finalizar(request.user.id, id);
            return response.status(200).json({locacao});
        }catch(err){
            return responderErro(response, err);
        }
    }
}

module.exports = new LocacaoController();
