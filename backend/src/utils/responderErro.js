const ApiError = require("../errors/ApiError");

function responderErro(response, err){
    if(err instanceof ApiError){
        return response.status(err.statusCode).json({error: err.message});
    }
    console.error(err);
    return response.status(500).json({error: "Erro interno do servidor"});
}

module.exports = responderErro;
