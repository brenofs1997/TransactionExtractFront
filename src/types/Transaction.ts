export type Transaction = {
    id:number;
    data_transferencia:string;
    valor :number;
    tipo :string;
    nome_operador_transacao : string;
    conta : Conta;
}

type Conta = {
    id_conta :number;
    nome_responsavel:string;
}