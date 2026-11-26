import { useEffect, useState } from "react";
import LocacaoService from "../services/LocacaoService";
import type { Locacao } from "../types/Locacao";
import Mensagem from "../components/Mensagem";
import { obterMensagemErro } from "../utils/erro";
import { formatarData, formatarMoeda } from "../utils/formatar";

const MinhasLocacoes = () => {
    const [locacoes, setLocacoes] = useState<Locacao[]>([]);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    async function carregarLocacoes(){
        try{
            const data = await LocacaoService.findMany();
            setLocacoes(data.locacoes);
        }catch(error){
            setErro(obterMensagemErro(error));
        }
    }

    useEffect(()=>{
        carregarLocacoes();
    },[]);

    async function handleFinalizar(locacao:Locacao){
        if(!window.confirm(`Confirmar a devolução do ${locacao.veiculo.modelo} (${locacao.veiculo.placa})?`)){
            return;
        }
        setMensagem("");
        setErro("");
        try{
            await LocacaoService.finalizar(locacao.id);
            setMensagem(`Locação #${locacao.id} finalizada. O ${locacao.veiculo.modelo} está disponível novamente.`);
            await carregarLocacoes();
        }catch(error){
            setErro(obterMensagemErro(error));
        }
    }

    return(
        <div>
            <h1>Minhas locações</h1>
            <Mensagem tipo="sucesso" texto={mensagem}/>
            <Mensagem tipo="erro" texto={erro}/>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Veículo</th>
                        <th>Início</th>
                        <th>Devolução prevista</th>
                        <th>Devolvido em</th>
                        <th>Valor total</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {locacoes.map(locacao => (
                        <tr key={locacao.id}>
                            <td>{locacao.id}</td>
                            <td>{locacao.veiculo.marca} {locacao.veiculo.modelo} ({locacao.veiculo.placa})</td>
                            <td>{formatarData(locacao.dataInicio)}</td>
                            <td>{formatarData(locacao.dataPrevistaDevolucao)}</td>
                            <td>{formatarData(locacao.dataDevolucao)}</td>
                            <td>{formatarMoeda(locacao.valorTotal)}</td>
                            <td>
                                <span className={locacao.status === "ATIVA" ? "status status-ok" : "status status-off"}>
                                    {locacao.status === "ATIVA" ? "Ativa" : "Finalizada"}
                                </span>
                            </td>
                            <td>
                                {locacao.status === "ATIVA" && <button onClick={() => handleFinalizar(locacao)}>Finalizar</button>}
                            </td>
                        </tr>
                    ))}
                    {locacoes.length === 0 && (
                        <tr><td colSpan={8}>Você ainda não possui locações.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default MinhasLocacoes;
