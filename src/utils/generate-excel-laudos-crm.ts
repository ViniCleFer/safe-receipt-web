/* eslint-disable @typescript-eslint/no-explicit-any */
import slugify from 'slugify';
import * as ExcelJS from 'exceljs';
import dayjs from 'dayjs';

import { listaTurnos } from './listaTurnos';
import { fileDownload } from '@/utils/fileDownload';
import { tiposNaoConformidade } from './tiposNaoConformidade';
import { getLaudosCrmRequest } from '@/app/dashboard/actions';

export async function generateExcelLaudosCrm(): Promise<void | null> {
  const laudosCrm = await getLaudosCrmRequest();

  if (!laudosCrm || laudosCrm.data.length === 0) {
    return null;
  }

  const laudosCrmFormatados = laudosCrm?.data?.map((item: any) => ({
    'ID LAUDO': item.id,
    'ID PTP': item.form_ptp_id,
    Remessa: item?.remessa,
    Transportador: item?.transportador,
    Placa: item?.placa,
    'Nota Fiscal': item?.notaFiscal,
    'Data de Identificação': dayjs(item?.dataIdentificacao).format(
      'DD/MM/YYYY',
    ),
    Conferente: item?.conferente,
    Turno: listaTurnos?.find(t => t.value === item.turno)?.label,
    'UP Origem': item?.upOrigem,
    'CD Origem': item?.cdOrigem,
    'Detalhe da Não Conformidade': item?.tiposNaoConformidade
      ?.map?.(
        (tipo: string) =>
          tiposNaoConformidade?.find(item => item?.value === tipo)?.label,
      )
      ?.join(', '),
    Observações: item?.observacoes,
    'Qtd. Evidências': item?.evidencias?.length,
  }));

  const header = Object.keys(laudosCrmFormatados[0]);
  const workbook = new ExcelJS.Workbook();

  function getCellValueLength(value: any): number {
    return value ? value.toString().length : 0;
  }

  const worksheetLaudosCrm = workbook.addWorksheet('Laudos CRM');

  worksheetLaudosCrm.addRow(header);

  worksheetLaudosCrm.columns = header.map(item => ({
    header: item,
    key: slugify(item),
    collapsed: true,
    outlineLevel: 2,
  }));

  const firstRowMembros = worksheetLaudosCrm.getRow(1);
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

  worksheetLaudosCrm.columns.forEach(column => {
    const values = column.values?.filter(value => value !== undefined) ?? [];
    const maxColumnWidth = Math.max(20, ...values.map(getCellValueLength));
    column.width = maxColumnWidth;
  });

  for (const item of laudosCrmFormatados) {
    const row = Object.values(item).map(String);
    worksheetLaudosCrm.addRow(row);
  }

  const excelBuffer = await workbook.xlsx.writeBuffer({});
  const excelData = new Blob([excelBuffer]);
  fileDownload(excelData, 'Relatório dos Laudos CRM.xlsx');
}
