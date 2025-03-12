/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs';
import slugify from 'slugify';
import * as ExcelJS from 'exceljs';

import { fileDownload } from '@/utils/fileDownload';
import { listaTurnos } from './listaTurnos';
import { CartaControle } from '@/types/carta-controle';
import { getCartasControleRequest } from '@/app/dashboard/actions';

export async function generateExcelCartasControle(): Promise<void | null> {
  const cartasControle = await getCartasControleRequest();

  if (!cartasControle || cartasControle?.data?.length === 0) {
    return null;
  }

  const cartasControleData = cartasControle?.data?.map(
    (item: CartaControle) => ({
      ID: item.id,
      'Data de Recebimento': dayjs(item?.dataIdentificacao).format(
        'DD/MM/YYYY',
      ),
      Turno: listaTurnos?.find(t => t.value === item.turno)?.label,
      'Documento Transporte': item?.documentoTransporte,
      Remessa: item?.remessa,
      Conferente: item?.conferente,
      Doca: item?.doca,
      'Capacidade Veículo': item?.capacidadeVeiculo,
      Observações: item?.observacoes,
      'Qtd. Evidências': item?.evidencias?.length,
    }),
  );

  const header = Object.keys(cartasControleData[0]);
  const workbook = new ExcelJS.Workbook();

  function getCellValueLength(value: any): number {
    return value ? value.toString().length : 0;
  }

  const worksheetFormsPtp = workbook.addWorksheet('Carta Controle');

  worksheetFormsPtp.addRow(header);

  worksheetFormsPtp.columns = header.map(item => ({
    header: item,
    key: slugify(item),
    collapsed: true,
    outlineLevel: 2,
  }));

  const firstRowMembros = worksheetFormsPtp.getRow(1);
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

  worksheetFormsPtp.columns.forEach(column => {
    const values = column.values?.filter(value => value !== undefined) ?? [];
    const maxColumnWidth = Math.max(20, ...values.map(getCellValueLength));
    column.width = maxColumnWidth;
  });

  for (const item of cartasControleData) {
    const row = Object.values(item).map(String);
    worksheetFormsPtp.addRow(row);
  }

  const excelBuffer = await workbook.xlsx.writeBuffer({});
  const excelData = new Blob([excelBuffer]);
  fileDownload(excelData, 'Relatório de Cartas Controle.xlsx');
}
