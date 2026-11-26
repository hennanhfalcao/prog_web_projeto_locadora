export function formatarMoeda(valor:string | number):string{
    return Number(valor).toLocaleString("pt-BR", {style: "currency", currency: "BRL"});
}

export function formatarData(data:string | null):string{
    if(!data) return "-";
    return new Date(data).toLocaleString("pt-BR", {dateStyle: "short", timeStyle: "short"});
}

export function paraInputDataHora(data:Date):string{
    const local = new Date(data.getTime() - data.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
}
