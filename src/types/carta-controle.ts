/* eslint-disable @typescript-eslint/no-explicit-any */
import { Turno } from './laudo-crm';
import { User } from './user';

export enum TipoEvidenciaCartaControle {
  ORDEM_CARREGAMENTO = 'ORDEM_CARREGAMENTO',
  CARGA_DOCA = 'CARGA_DOCA',
  INICIO_CARREGAMENTO = 'INICIO_CARREGAMENTO',
  MEIO_CARREGAMENTO = 'MEIO_CARREGAMENTO',
  FINAL_CARREGAMENTO = 'FINAL_CARREGAMENTO',
  PLACA_VEICULO = 'PLACA_VEICULO',
}

export interface EvidenciaPost {
  base64: string;
  filename: string;
  mimetype: string;
  size: number;
}

export interface CartaControle {
  id: string;
  dataIdentificacao: Date;
  turno: Turno;
  documentoTransporte: string;
  remessa: string;
  conferente: string;
  doca: string;
  capacidadeVeiculo: string;
  evidencias: any[];
  observacoes: string;
  user_id: string;
  users?: User;
  created_at: Date;
  updated_at: Date;
  canceled_at: Date | null;
}

export interface CartaControlePost {
  dataIdentificacao: Date;
  turno: Turno;
  documentoTransporte: string;
  remessa: string;
  conferente: string;
  doca: string;
  capacidadeVeiculo: string;
  evidencias: string[];
  observacoes: string;
  user_id: string;
}

export interface CartaControlePut extends CartaControlePost {
  id: string;
}
