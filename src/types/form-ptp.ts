export enum FormPtpStatus {
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  FINALIZADO = 'FINALIZADO',
}

export enum TipoCodigoProduto {
  MISTO = 'MISTO',
  EXCLUSIVO = 'EXCLUSIVO',
}

export interface FormPtp {
  id: string;
  dataExecucao: Date;
  conferente: string;
  notaFiscal: string;
  opcaoUp: string;
  qtdAnalisada: number;
  tipoCodigoProduto: TipoCodigoProduto;
  status: FormPtpStatus;
  created_at: Date;
  updated_at: Date;
  canceled_at: Date | null;
}
