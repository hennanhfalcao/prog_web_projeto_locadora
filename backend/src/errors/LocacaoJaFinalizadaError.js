const ApiError = require("./ApiError");

class LocacaoJaFinalizadaError extends ApiError{
    constructor(message="Locação já finalizada", statusCode=409){
        super(message, statusCode);
    }
}

module.exports = LocacaoJaFinalizadaError;
