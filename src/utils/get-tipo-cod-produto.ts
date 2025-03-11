import { TipoCodigoProduto } from '@/types/form-ptp';

export function getTipoCodigoProduto(tipoCodigoProduto: TipoCodigoProduto) {
  switch (tipoCodigoProduto) {
    case TipoCodigoProduto.EXCLUSIVO:
      return 'Exclusivo';
    case TipoCodigoProduto.MISTO:
      return 'Misto';
    default:
      return 'Tipo desconhecido';
  }
}
