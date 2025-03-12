/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs';
import slugify from 'slugify';
import * as ExcelJS from 'exceljs';

import { wordNormalize } from './wordNormalize';
import { fileDownload } from '@/utils/fileDownload';
import { tiposNaoConformidade } from './tiposNaoConformidade';
import { getAllFormsPtpAnswerWithFormPtpRelationship } from '@/app/dashboard/actions';
import { getTipoEspecificacao } from './get-tipo-especificacao';

export async function generateExcelFormsPtp(): Promise<void | null> {
  const formsPtpAnswerWithFormPtp =
    await getAllFormsPtpAnswerWithFormPtpRelationship();

  if (
    !formsPtpAnswerWithFormPtp ||
    formsPtpAnswerWithFormPtp.data.length === 0
  ) {
    return null;
  }

  const formsPtp = formsPtpAnswerWithFormPtp?.data?.map((item: any) => ({
    'ID PTP': item.form_ptp_id,
    'Tipo PTP': getTipoEspecificacao(item?.form_ptp?.tipoEspecificacao),
    'Nota Fiscal': item?.form_ptp?.notaFiscal,
    'Data de Recebimento': dayjs(item?.form_ptp?.dataExecucao).format(
      'DD/MM/YYYY',
    ),
    Conferente: item?.form_ptp?.conferente,
    'Opção UP': item?.form_ptp?.opcaoUp,
    'Qtd. Analisada': item?.form_ptp?.qtdAnalisada,
    Enunciado: item?.enunciado?.descricao,
    'Tipo do Grupo': wordNormalize(item?.enunciado?.grupo || ''),
    'Código do Produto': item?.codProduto,
    Lote: item?.lote ? item?.lote : 'N/A',
    'Detalhe da Não Conformidade': item?.detalheNaoConformidade
      ?.map?.(
        (tipo: string) =>
          tiposNaoConformidade?.find(item => item?.value === tipo)?.label,
      )
      ?.join(', '),
    'Qtd. Pallets Não Conforme': item?.qtdPalletsNaoConforme,
    'Qtd. Caixas Não Conforme': item?.qtdCaixasNaoConforme,
  }));

  const header = Object.keys(formsPtp[0]);
  const workbook = new ExcelJS.Workbook();

  function getCellValueLength(value: any): number {
    return value ? value.toString().length : 0;
  }

  const worksheetFormsPtp = workbook.addWorksheet('Formulários PTP');

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

  for (const item of formsPtp) {
    const row = Object.values(item).map(String);
    worksheetFormsPtp.addRow(row);
  }

  const excelBuffer = await workbook.xlsx.writeBuffer({});
  const excelData = new Blob([excelBuffer]);
  fileDownload(excelData, 'Relatório de Formuários PTP.xlsx');
}
