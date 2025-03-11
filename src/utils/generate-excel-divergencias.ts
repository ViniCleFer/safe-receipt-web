/* eslint-disable @typescript-eslint/no-explicit-any */
import slugify from 'slugify';
import * as ExcelJS from 'exceljs';

import { fileDownload } from '@/utils/fileDownload';
import { getDivergencesRequest } from '@/app/dashboard/actions';
import { Divergencia } from '@/types/divergencia';
import dayjs from 'dayjs';

export async function generateExcelDivergencias(): Promise<void | null> {
  const divergencias = await getDivergencesRequest();

  if (!divergencias || divergencias.data.length === 0) {
    return null;
  }

  const divergenciasFormatadas = divergencias?.data?.map(
    (item: Partial<Divergencia>) => ({
      ID: item.id as string,
      Tipo: item?.tipoDivergencia,
      'Nota Fiscal': item?.notaFiscal,
      'Data de Preenchimento': dayjs(item?.created_at).format('DD/MM/YYYY'),
      'Sku Faltando Fisicamente': item?.skuFaltandoFisicamente,
      'Qtd Faltando Fisicamente': item?.qtdFaltandoFisicamente,
      'Sku Sobrando Fisicamente': item?.skuSobrandoFisicamente,
      'Qtd Sobrando Fisicamente': item?.qtdSobrandoFisicamente,
      'Sku Recebemos Fisicamente': item?.skuRecebemosFisicamente,
      'Qtd Recebemos Fisicamente': item?.qtdRecebemosFisicamente,
      'Sku Nota Fiscal': item?.skuNotaFiscal,
      'Qtd Nota Fiscal': item?.qtdNotaFiscal,
      'Próximo Passo': item?.proximoPasso,
    }),
  );

  const header = Object.keys(divergenciasFormatadas[0]);
  const workbook = new ExcelJS.Workbook();

  function getCellValueLength(value: any): number {
    return value ? value.toString().length : 0;
  }

  const worksheetDivergencias = workbook.addWorksheet('Divergências');

  worksheetDivergencias.addRow(header);

  worksheetDivergencias.columns = header.map(item => ({
    header: item,
    key: slugify(item),
    collapsed: true,
    outlineLevel: 2,
  }));

  const firstRowMembros = worksheetDivergencias.getRow(1);
  firstRowMembros.eachCell(function (cell) {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '084077' },
    };
    cell.font = {
      color: { argb: 'FFFFFF' },
    };
  });

  worksheetDivergencias.columns.forEach(column => {
    const values = column.values?.filter(value => value !== undefined) ?? [];
    const maxColumnWidth = Math.max(20, ...values.map(getCellValueLength));
    column.width = maxColumnWidth;
  });

  for (const item of divergenciasFormatadas) {
    const row = Object.values(item).map(String);
    worksheetDivergencias.addRow(row);
  }

  const excelBuffer = await workbook.xlsx.writeBuffer({});
  const excelData = new Blob([excelBuffer]);
  fileDownload(excelData, 'Relatório de Divergências.xlsx');
}
