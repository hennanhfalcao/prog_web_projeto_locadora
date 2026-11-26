import type { Veiculo } from "./Veiculo";

export interface Locacao{
    id:number,
    usuarioId:number,
    veiculoId:number,
    dataInicio:string,
    dataPrevistaDevolucao:string,
    dataDevolucao:string | null,
    valorTotal:string,
    status:"ATIVA" | "FINALIZADA",
    veiculo:Omit<Veiculo, "disponivel" | "criadoEm">
}
