import { FormPtpStatus } from '@/types/form-ptp';

export function getFormPtpStatus(status: FormPtpStatus) {
  switch (status) {
    case FormPtpStatus.EM_ANDAMENTO:
      return 'Em andamento';
    case FormPtpStatus.FINALIZADO:
      return 'Finalizado';
    default:
      return 'Status desconhecido';
  }
}
