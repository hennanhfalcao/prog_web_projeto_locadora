import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useSearchParams } from "react-router";
import VeiculoService from "../services/VeiculoService";
import LocacaoService from "../services/LocacaoService";
import type { Veiculo } from "../types/Veiculo";
import Mensagem from "../components/Mensagem";
import { obterMensagemErro } from "../utils/erro";
import { formatarMoeda, paraInputDataHora } from "../utils/formatar";

const NovaLocacao = () => {
    const [searchParams] = useSearchParams();
    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
    const [veiculoId, setVeiculoId] = useState(searchParams.get("veiculoId") ?? "");
    const [dataInicio, setDataInicio] = useState(paraInputDataHora(new Date()));
    const [dataPrevistaDevolucao, setDataPrevistaDevolucao] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    async function carregarVeiculos(){
        try{
            const data = await VeiculoService.findMany(true);
            setVeiculos(data.veiculos);
        }catch(error){
            setErro(obterMensagemErro(error));
        }
    }

    useEffect(()=>{
        carregarVeiculos();
    },[]);

    async function handleSubmit(event:FormEvent<HTMLFormElement>){
        event.preventDefault();
        setMensagem("");
        setErro("");
        setEnviando(true);
        try{
            const data = await LocacaoService.create({
                veiculoId: Number(veiculoId),
                dataInicio: new Date(dataInicio).toISOString(),
                dataPrevistaDevolucao: new Date(dataPrevistaDevolucao).toISOString()
            });
            const {locacao} = data;
            setMensagem(`Locação #${locacao.id} registrada: ${locacao.veiculo.modelo} (${locacao.veiculo.placa}). Valor total: ${formatarMoeda(locacao.valorTotal)}`);
            setVeiculoId("");
            setDataInicio(paraInputDataHora(new Date()));
            setDataPrevistaDevolucao("");
            await carregarVeiculos();
        }catch(error){
            setErro(obterMensagemErro(error));
            await carregarVeiculos();
        }finally{
            setEnviando(false);
        }
    }

    const veiculoSelecionado = veiculos.find((veiculo) => veiculo.id === Number(veiculoId));

    return(
        <div className="container-estreito">
            <h1>Nova locação</h1>
            <Mensagem tipo="sucesso" texto={mensagem}/>
            <Mensagem tipo="erro" texto={erro}/>
            {mensagem && <p><Link to="/locacoes">Ver minhas locações</Link></p>}
            <form className="formulario" onSubmit={handleSubmit}>
                <label htmlFor="veiculoId">Veículo disponível</label>
                <select id="veiculoId" value={veiculoId} onChange={(event) => setVeiculoId(event.target.value)} required>
                    <option value="">Selecione um veículo</option>
                    {veiculos.map(veiculo => (
                        <option key={veiculo.id} value={veiculo.id}>
                            {veiculo.marca} {veiculo.modelo} - {veiculo.placa} ({formatarMoeda(veiculo.valorDiaria)}/dia)
                        </option>
                    ))}
                </select>
                {veiculoSelecionado && <small>Diária: {formatarMoeda(veiculoSelecionado.valorDiaria)} — qualquer fração de 24h conta como diária completa.</small>}

                <label htmlFor="dataInicio">Data de início</label>
                <input id="dataInicio" type="datetime-local" value={dataInicio} onChange={(event) => setDataInicio(event.target.value)} required/>

                <label htmlFor="dataPrevistaDevolucao">Data prevista de devolução</label>
                <input id="dataPrevistaDevolucao" type="datetime-local" min={dataInicio} value={dataPrevistaDevolucao} onChange={(event) => setDataPrevistaDevolucao(event.target.value)} required/>

                <button type="submit" disabled={enviando}>Alugar</button>
            </form>
        </div>
    );
}

export default NovaLocacao;
