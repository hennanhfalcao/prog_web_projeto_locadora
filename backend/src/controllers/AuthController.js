const authService = require("../services/AuthService");
const responderErro = require("../utils/responderErro");

class AuthController{
    async login(request, response){
        try{
            const {token, usuario} = await authService.login(request.body);
            return response.status(200).json({token, usuario});
        }catch(err){
            return responderErro(response, err);
        }
    }
}

module.exports = new AuthController();
