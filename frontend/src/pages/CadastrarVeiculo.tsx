import { useState } from "react";
import type { FormEvent } from "react";
import VeiculoService from "../services/VeiculoService";
import Mensagem from "../components/Mensagem";
import { obterMensagemErro } from "../utils/erro";

const CadastrarVeiculo = () => {
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [placa, setPlaca] = useState("");
    const [ano, setAno] = useState("");
    const [valorDiaria, setValorDiaria] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    async function handleSubmit(event:FormEvent<HTMLFormElement>){
        event.preventDefault();
        setMensagem("");
        setErro("");
        setEnviando(true);
        try{
            const data = await VeiculoService.create({
                marca,
                modelo,
                placa,
                ano: Number(ano),
                valorDiaria: Number(valorDiaria)
            });
            setMensagem(`Veículo ${data.veiculo.modelo} (${data.veiculo.placa}) cadastrado com sucesso!`);
            setMarca("");
            setModelo("");
            setPlaca("");
            setAno("");
            setValorDiaria("");
        }catch(error){
            setErro(obterMensagemErro(error));
        }finally{
            setEnviando(false);
        }
    }

    return(
        <div className="container-estreito">
            <h1>Cadastrar veículo</h1>
            <Mensagem tipo="sucesso" texto={mensagem}/>
            <Mensagem tipo="erro" texto={erro}/>
            <form className="formulario" onSubmit={handleSubmit}>
                <label htmlFor="marca">Marca</label>
                <input id="marca" value={marca} onChange={(event) => setMarca(event.target.value)} required/>

                <label htmlFor="modelo">Modelo</label>
                <input id="modelo" value={modelo} onChange={(event) => setModelo(event.target.value)} required/>

                <label htmlFor="placa">Placa</label>
                <input id="placa" placeholder="ABC1D23" maxLength={8} value={placa} onChange={(event) => setPlaca(event.target.value.toUpperCase())} required/>

                <label htmlFor="ano">Ano</label>
                <input id="ano" type="number" value={ano} onChange={(event) => setAno(event.target.value)} required/>

                <label htmlFor="valorDiaria">Valor da diária (R$)</label>
                <input id="valorDiaria" type="number" step="0.01" min="0.01" value={valorDiaria} onChange={(event) => setValorDiaria(event.target.value)} required/>

                <button type="submit" disabled={enviando}>Cadastrar</button>
            </form>
        </div>
    );
}

export default CadastrarVeiculo;
