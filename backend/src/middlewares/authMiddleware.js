const {validarToken} = require("../utils/jwt");

module.exports = (request, response, next)=>{

    const authorization = request.headers.authorization;

    if(!authorization){
        return response.status(401).json({error: "Token não informado"});
    }

    const [tipo, token, extra] = authorization.split(" ");

    if(tipo !== "Bearer" || !token || extra){
        return response.status(401).json({error: "Token inválido"});
    }

    try{
        const payload = validarToken(token);

        request.user = {
            id: Number(payload.sub),
            nome: payload.nome,
            email: payload.email
        };

        next();

    }catch(err){
        return response.status(401).json({error: "Token inválido ou expirado"});
    }
};
