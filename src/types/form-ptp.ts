export enum FormPtpStatus {
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  FINALIZADO = 'FINALIZADO',
}

export enum TipoCodigoProduto {
  MISTO = 'MISTO',
  EXCLUSIVO = 'EXCLUSIVO',
}

export enum TipoEspecificacao {
  RECEBIMENTO = 'RECEBIMENTO',
  SEPARACAO_MONTAGEM = 'SEPARACAO_MONTAGEM',
  ARMAZENAMENTO = 'ARMAZENAMENTO',
}

export interface FormPtp {
  id: string;
  dataExecucao: Date;
  conferente: string;
  notaFiscal: string;
  opcaoUp: string;
  qtdAnalisada: number;
  tipoCodigoProduto: TipoCodigoProduto;
  tipoEspecificacao: TipoEspecificacao;
  status: FormPtpStatus;
  created_at: Date;
  updated_at: Date;
  canceled_at: Date | null;
}
