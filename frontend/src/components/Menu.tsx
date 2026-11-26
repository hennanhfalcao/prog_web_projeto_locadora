import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import AuthService from "../services/AuthService";
import type { Usuario } from "../types/Usuario";

function Menu(){
    const [usuario, setUsuario] = useState<Usuario | null>(null);

    useEffect(()=>{
        async function buscarUsuario(){
            const data = await AuthService.me();
            setUsuario(data.usuario);
        }

        buscarUsuario();
    },[]);

    return(
        <header className="menu">
            <strong>Locadora</strong>
            <nav>
                <NavLink to="/veiculos" end>Veículos</NavLink>
                <NavLink to="/veiculos/cadastrar">Cadastrar veículo</NavLink>
            </nav>
            <div className="menu-usuario">
                <span>{usuario ? `Olá, ${usuario.nome}` : ""}</span>
                <NavLink to="/logout" replace>Sair</NavLink>
            </div>
        </header>
    );
}

export default Menu;
