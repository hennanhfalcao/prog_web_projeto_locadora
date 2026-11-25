const usuarioService = require("../services/UsuarioService");
const responderErro = require("../utils/responderErro");

class UsuarioController{
    async create(request, response){
        try{
            const usuario = await usuarioService.create(request.body);
            return response.status(201).json({usuario});
        }catch(err){
            return responderErro(response, err);
        }
    }

    async me(request, response){
        try{
            const usuario = await usuarioService.findById(request.user.id);
            return response.status(200).json({usuario});
        }catch(err){
            return responderErro(response, err);
        }
    }
}

module.exports = new UsuarioController();
