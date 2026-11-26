import api from "../api/api";
import type { LocacaoForm } from "../types/LocacaoForm";

class LocacaoService{
    async create(locacao:LocacaoForm){
        const response = await api.post("/locacoes", locacao);
        return response.data;
    }

    async findMany(){
        const response = await api.get("/locacoes");
        return response.data;
    }

    async finalizar(id:number){
        const response = await api.patch(`/locacoes/${id}/finalizar`);
        return response.data;
    }
}

export default new LocacaoService();
