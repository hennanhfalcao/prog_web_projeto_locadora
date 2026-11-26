const ApiError = require("./ApiError");

class NaoEncontradoError extends ApiError{
    constructor(message="Recurso não encontrado", statusCode=404){
        super(message, statusCode);
    }
}

module.exports = NaoEncontradoError;
