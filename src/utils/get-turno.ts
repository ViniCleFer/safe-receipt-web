import { Turno } from '@/types/laudo-crm';

export function getTurno(turno: Turno) {
  switch (turno) {
    case Turno.T1:
      return '1º turno';
    case Turno.T2:
      return '2º turno';
    case Turno.T3:
      return '3º turno';
    default:
      return 'Turno desconhecido';
  }
}
