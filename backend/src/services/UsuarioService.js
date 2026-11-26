const bcrypt = require("bcrypt");
const prisma = require("../databases/prisma");
const EmailEmUsoError = require("../errors/EmailEmUsoError");
const NaoEncontradoError = require("../errors/NaoEncontradoError");

const usuarioSemSenha = {
    id: true,
    nome: true,
    email: true,
    criadoEm: true
};

class UsuarioService{
    async create({nome, email, senha}){
        const existente = await prisma.usuario.findUnique({
            where: {email}
        });

        if(existente){
            throw new EmailEmUsoError();
        }

        try{
            const novoUsuario = await prisma.usuario.create({
                data:{
                    nome,
                    email,
                    senha: await bcrypt.hash(senha, 10)
                },
                select: usuarioSemSenha
            });

            return novoUsuario;
        }catch(err){
            if(err.code === "P2002"){
                throw new EmailEmUsoError();
            }
            throw err;
        }
    }

    async findById(id){
        const usuario = await prisma.usuario.findUnique({
            where: {id},
            select: usuarioSemSenha
        });

        if(!usuario){
            throw new NaoEncontradoError("Usuário não encontrado");
        }

        return usuario;
    }
}

module.exports = new UsuarioService();
