const ApiError = require("./ApiError");

class RequisicaoInvalidaError extends ApiError{
    constructor(message="Requisição inválida", statusCode=400){
        super(message, statusCode);
    }
}

module.exports = RequisicaoInvalidaError;
