import axios from "axios";

interface ErroCampo{
    campo:string,
    message:string
}

export function obterMensagemErro(error:unknown):string{
    if(axios.isAxiosError(error)){
        if(!error.response){
            return "Não foi possível conectar à API";
        }
        const data = error.response.data;
        if(data?.error){
            return data.error;
        }
        if(Array.isArray(data?.errors)){
            return data.errors.map((e:ErroCampo) => e.message).join(" | ");
        }
    }
    return "Erro inesperado";
}
