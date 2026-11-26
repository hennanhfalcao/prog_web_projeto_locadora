const RequisicaoInvalidaError = require("../errors/RequisicaoInvalidaError");

function converterId(valor, mensagem="Id inválido"){
    const id = Number(valor);

    if(!Number.isInteger(id) || id <= 0){
        throw new RequisicaoInvalidaError(mensagem);
    }

    return id;
}

module.exports = converterId;
