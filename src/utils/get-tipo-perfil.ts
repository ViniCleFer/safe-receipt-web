import { TipoPerfil } from '@/types/user';

export function getTipoPerfil(tipoPerfil: TipoPerfil) {
  switch (tipoPerfil) {
    case TipoPerfil.ADMIN:
      return 'Administrador';
    case TipoPerfil.MEMBER:
      return 'Membro';
    default:
      return 'Tipo desconhecido';
  }
}
