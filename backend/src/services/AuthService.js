const bcrypt = require("bcrypt");
const prisma = require("../databases/prisma");
const CredenciaisInvalidasError = require("../errors/CredenciaisInvalidasError");
const {gerarToken} = require("../utils/jwt");

class AuthService{
    async login({email, senha}){
        const usuario = await prisma.usuario.findUnique({
            where: {email}
        });

        if(!usuario){
            throw new CredenciaisInvalidasError();
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if(!senhaValida){
            throw new CredenciaisInvalidasError();
        }

        return {
            token: gerarToken(usuario),
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        };
    }
}

module.exports = new AuthService();
