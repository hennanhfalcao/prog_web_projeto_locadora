interface MensagemProps{
    tipo:"sucesso" | "erro",
    texto:string
}

function Mensagem({tipo, texto}:MensagemProps){
    if(!texto) return null;

    return <p className={`mensagem mensagem-${tipo}`}>{texto}</p>
}

export default Mensagem;
