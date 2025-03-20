import { TipoEvidenciaCartaControle } from '@/types/carta-controle';
import { TipoEvidencia } from '@/types/laudo-crm';

export function getTipoEvidencia(
  tipoEvidencia: TipoEvidenciaCartaControle | TipoEvidencia,
) {
  switch (tipoEvidencia) {
    case TipoEvidenciaCartaControle.ORDEM_CARREGAMENTO:
      return 'Ordem de carregamento';
    case TipoEvidenciaCartaControle.CARGA_DOCA:
      return 'Carga na doca';
    case TipoEvidenciaCartaControle.INICIO_CARREGAMENTO:
      return 'Início do carregamento';
    case TipoEvidenciaCartaControle.MEIO_CARREGAMENTO:
      return 'Meio do carregamento';
    case TipoEvidenciaCartaControle.FINAL_CARREGAMENTO:
      return 'Final do carregamento';
    case TipoEvidenciaCartaControle.PLACA_VEICULO:
      return 'Placa do veículo';
    case TipoEvidencia.AVARIAS:
      return 'Avarias';
    case TipoEvidencia.ETIQUETA_CAIXA:
      return 'Etiqueta da caixa';
    case TipoEvidencia.PALLETS:
      return 'Pallets';
    case TipoEvidencia.UC:
      return 'UC';
    default:
      return 'Turno desconhecido';
  }
}
