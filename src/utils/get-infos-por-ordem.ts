/* eslint-disable @typescript-eslint/no-explicit-any */
// import { CaracteristicasGeneroRacaAdmConselhoFiscal } from '@prisma/client';

// 1 - Ordem de carregamento
// 2 - Carga em doca
// 3 - Início carregamento
// 4 - Meio carregamento
// 5 - Fim carregamento
// 6 - Placa veículo

const ordemPrioridade: Record<string, number> = {
  ORDEM_CARREGAMENTO: 1,
  CARGA_DOCA: 2,
  INICIO_CARREGAMENTO: 3,
  MEIO_CARREGAMENTO: 4,
  FINAL_CARREGAMENTO: 5,
  PLACA_VEICULO: 6,
};

export function getInfosPorOrdem(data: any[]): any[] {
  if (!Array.isArray(data) || data.length === 0) {
    return data;
  }

  return data?.sort((a, b) => {
    const prioridadeA = ordemPrioridade[a?.grupo] ?? Number.MAX_SAFE_INTEGER;
    const prioridadeB = ordemPrioridade[b?.grupo] ?? Number.MAX_SAFE_INTEGER;
    return prioridadeA - prioridadeB;
  });
}
