import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import AuthService from "../services/AuthService";
import Mensagem from "../components/Mensagem";
import { obterMensagemErro } from "../utils/erro";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    async function handleSubmit(event:FormEvent<HTMLFormElement>){
        event.preventDefault();
        setErro("");
        setEnviando(true);
        try{
            const data = await AuthService.login({email, senha});
            localStorage.setItem("token", data.token);
            navigate("/veiculos", {replace:true});
        }catch(error){
            setErro(obterMensagemErro(error));
            setSenha("");
        }finally{
            setEnviando(false);
        }
    }

    return(
        <main className="container container-estreito">
            <h1>Login</h1>
            <Mensagem tipo="sucesso" texto={location.state?.mensagem ?? ""}/>
            <Mensagem tipo="erro" texto={erro}/>
            <form className="formulario" onSubmit={handleSubmit}>
                <label htmlFor="email">E-mail</label>
                <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required/>

                <label htmlFor="senha">Senha</label>
                <input id="senha" type="password" value={senha} onChange={(event) => setSenha(event.target.value)} required/>

                <button type="submit" disabled={enviando}>Entrar</button>
            </form>
            <p>Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
        </main>
    );
}

export default Login;
