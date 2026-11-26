import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import AuthService from "../services/AuthService";
import Mensagem from "../components/Mensagem";
import { obterMensagemErro } from "../utils/erro";

const Cadastro = () => {
    const navigate = useNavigate();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    async function handleSubmit(event:FormEvent<HTMLFormElement>){
        event.preventDefault();
        setErro("");
        setEnviando(true);
        try{
            await AuthService.cadastrar({nome, email, senha});
            navigate("/login", {replace:true, state:{mensagem:"Cadastro realizado! Faça login para continuar."}});
        }catch(error){
            setErro(obterMensagemErro(error));
        }finally{
            setEnviando(false);
        }
    }

    return(
        <main className="container container-estreito">
            <h1>Cadastro</h1>
            <Mensagem tipo="erro" texto={erro}/>
            <form className="formulario" onSubmit={handleSubmit}>
                <label htmlFor="nome">Nome</label>
                <input id="nome" value={nome} onChange={(event) => setNome(event.target.value)} required/>

                <label htmlFor="email">E-mail</label>
                <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required/>

                <label htmlFor="senha">Senha</label>
                <input id="senha" type="password" minLength={6} value={senha} onChange={(event) => setSenha(event.target.value)} required/>

                <button type="submit" disabled={enviando}>Cadastrar</button>
            </form>
            <p>Já tem conta? <Link to="/login">Entrar</Link></p>
        </main>
    );
}

export default Cadastro;
