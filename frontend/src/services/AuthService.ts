import api from "../api/api";
import type { LoginForm } from "../types/LoginForm";
import type { CadastroForm } from "../types/CadastroForm";

class AuthService{
    async login({email, senha}:LoginForm){
        const response = await api.post("/login", {email, senha});
        return response.data;
    }

    async cadastrar({nome, email, senha}:CadastroForm){
        const response = await api.post("/usuarios", {nome, email, senha});
        return response.data;
    }

    async me(){
        const response = await api.get("/usuarios/me");
        return response.data;
    }
}

export default new AuthService();
