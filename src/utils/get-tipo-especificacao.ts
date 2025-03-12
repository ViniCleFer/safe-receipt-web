import { TipoEspecificacao } from '@/types/form-ptp';

export function getTipoEspecificacao(tipoEspecificacao: TipoEspecificacao) {
  switch (tipoEspecificacao) {
    case TipoEspecificacao.ARMAZENAMENTO:
      return 'Armazenamento';
    case TipoEspecificacao.RECEBIMENTO:
      return 'Recebimento';
    case TipoEspecificacao.SEPARACAO_MONTAGEM:
      return 'Separaçãp e Montagem';
    default:
      return 'Tipo desconhecido';
  }
}
