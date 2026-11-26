import api from "../api/api";
import type { VeiculoForm } from "../types/VeiculoForm";

class VeiculoService{
    async findMany(disponivel?:boolean){
        const response = await api.get("/veiculos", {
            params: disponivel === undefined ? {} : {disponivel}
        });
        return response.data;
    }

    async create(veiculo:VeiculoForm){
        const response = await api.post("/veiculos", veiculo);
        return response.data;
    }
}

export default new VeiculoService();
