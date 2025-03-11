import { FormPtp } from './form-ptp';

/* eslint-disable @typescript-eslint/no-explicit-any */
// export enum Enunciado {
//   NUM_CAMADAS = 'NUM_CAMADAS',
//   LIMPEZA = 'LIMPEZA',
//   PRESENCA_DATA_FABRICACAO = 'PRESENCA_DATA_FABRICACAO',
//   INTEGRIDADE_PALLET = 'INTEGRIDADE_PALLET',
//   AUSENCIA_VAZAMENTO = 'AUSENCIA_VAZAMENTO',
//   STRECH_FORRACAO = 'STRECH_FORRACAO',
//   ETIQUETA_UC = 'ETIQUETA_UC',
// }

export enum GrupoEnunciado {
  PALETE = 'PALETE',
  CAIXA_E_FARDO = 'CAIXA_E_FARDO',
}

export interface Enunciado {
  id: string;
  descricao: string;
  posicao: number;
  ativo: boolean;
  grupo: GrupoEnunciado;
  isChecked: boolean;
  opcoesNaoConformidades: string[];
  created_at: Date;
  updated_at: Date;
  canceled_at: Date | null;
}

export interface FormPtpAnswer {
  id: string;
  form_ptp_id: string;
  enunciado: Enunciado;
  codProduto: string;
  lote: string | null;
  naoConformidade: boolean;
  detalheNaoConformidade: string;
  qtdPalletsNaoConforme: number;
  qtdCaixasNaoConforme: number;
  necessitaCrm: boolean;
  created_at: Date;
  updated_at: Date;
  canceled_at: Date | null;
}

export interface FormPtpAnswerPost {
  form_ptp_id: string;
  enunciado_id: string;
  codProduto: string;
  naoConformidade: boolean;
  detalheNaoConformidade: string[] | any;
  lote: string | null;
  qtdPalletsNaoConforme: number;
  qtdCaixasNaoConforme: number;
  necessitaCrm: boolean;
}

export interface FormPtpAnswerPut extends FormPtpAnswerPost {
  id: string;
}

export interface FormPtpWithAnswer {
  id: string;
  form_ptp_id: string;
  enunciado: Enunciado;
  codProduto: string;
  lote: string | null;
  naoConformidade: boolean;
  detalheNaoConformidade: string;
  qtdPalletsNaoConforme: number;
  qtdCaixasNaoConforme: number;
  necessitaCrm: boolean;
  created_at: Date;
  updated_at: Date;
  canceled_at: Date | null;
  form_ptp: FormPtp;
}
