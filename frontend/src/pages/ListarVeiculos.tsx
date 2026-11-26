import { useEffect, useState } from "react";
import { Link } from "react-router";
import VeiculoService from "../services/VeiculoService";
import type { Veiculo } from "../types/Veiculo";
import Mensagem from "../components/Mensagem";
import { obterMensagemErro } from "../utils/erro";
import { formatarMoeda } from "../utils/formatar";

type Filtro = "todos" | "disponiveis" | "indisponiveis";

const ListarVeiculos = () => {
    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
    const [filtro, setFiltro] = useState<Filtro>("todos");
    const [erro, setErro] = useState("");

    useEffect(()=>{
        async function buscarVeiculos(){
            try{
                const disponivel = filtro === "todos" ? undefined : filtro === "disponiveis";
                const data = await VeiculoService.findMany(disponivel);
                setVeiculos(data.veiculos);
                setErro("");
            }catch(error){
                setErro(obterMensagemErro(error));
            }
        }

        buscarVeiculos();
    },[filtro]);

    return(
        <div>
            <h1>Veículos</h1>
            <Mensagem tipo="erro" texto={erro}/>
            <label htmlFor="filtro">Mostrar: </label>
            <select id="filtro" value={filtro} onChange={(event) => setFiltro(event.target.value as Filtro)}>
                <option value="todos">Todos</option>
                <option value="disponiveis">Somente disponíveis</option>
                <option value="indisponiveis">Somente locados</option>
            </select>
            <table>
                <thead>
                    <tr>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>Placa</th>
                        <th>Ano</th>
                        <th>Diária</th>
                        <th>Situação</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {veiculos.map(veiculo => (
                        <tr key={veiculo.id}>
                            <td>{veiculo.marca}</td>
                            <td>{veiculo.modelo}</td>
                            <td>{veiculo.placa}</td>
                            <td>{veiculo.ano}</td>
                            <td>{formatarMoeda(veiculo.valorDiaria)}</td>
                            <td>
                                <span className={veiculo.disponivel ? "status status-ok" : "status status-off"}>
                                    {veiculo.disponivel ? "Disponível" : "Locado"}
                                </span>
                            </td>
                            <td>
                                {veiculo.disponivel && <Link to={`/locacoes/nova?veiculoId=${veiculo.id}`}>Alugar</Link>}
                            </td>
                        </tr>
                    ))}
                    {veiculos.length === 0 && (
                        <tr><td colSpan={7}>Nenhum veículo encontrado.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default ListarVeiculos;
