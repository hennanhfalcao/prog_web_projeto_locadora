const ApiError = require("./ApiError");

class PlacaEmUsoError extends ApiError{
    constructor(message="Placa já cadastrada", statusCode=409){
        super(message, statusCode);
    }
}

module.exports = PlacaEmUsoError;
