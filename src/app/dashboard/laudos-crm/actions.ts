/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { createClient } from '@/lib/supabase/server';
import { tiposNaoConformidade as tiposNaoConformidadeList } from '@/utils/tiposNaoConformidade';
import { listaCDsOrigem, listaUPsOrigem } from '@/utils/listaUPs';

export async function getLaudosCrmRequest() {
  const supabase = await createClient();

  const { data, error, status } = await supabase
    .from('laudos-crm')
    .select(
      `
    *,
    forms-ptp:forms-ptp(*)
  `,
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error getLaudosCrmRequest', JSON.stringify(error, null, 2));
    return null;
  }

  return { data, status };
}

export async function getLaudosCrmByIdRequest(laudoCrmId: string) {
  const supabase = await createClient();

  const { data, error, status } = await supabase
    .from('laudos-crm')
    .select()
    .eq('id', laudoCrmId);

  if (error) {
    console.error(
      'Error getLaudosCrmByIdRequest',
      JSON.stringify(error, null, 2),
    );
    return null;
  }

  if (status === 200) {
    let laudosCrm: any[] = [];

    if (data?.length === 1) {
      for await (const laudoCrm of data as any[]) {
        const evidencias = laudoCrm?.evidencias;

        let urlsEvidencias: any[] = [];

        if (evidencias?.length === 0) {
          urlsEvidencias = [];
        } else {
          for await (const evidenciaId of evidencias) {
            const { data } = await getLaudoCrmEvidencesRequest(
              laudoCrm?.id,
              evidenciaId,
            );

            const evidencia = data?.publicUrl;

            if (evidencia) {
              urlsEvidencias = [...urlsEvidencias, evidencia];
            } else {
              urlsEvidencias = [...urlsEvidencias];
            }
          }
        }

        laudosCrm = [
          ...laudosCrm,
          {
            ...laudoCrm,
            evidencias: [...urlsEvidencias],
          },
        ];
      }

      const tiposNaoConformidadeFormatted = laudosCrm.map(laudo => {
        const tiposNaoConformidade = laudo?.tiposNaoConformidade;
        const lotes = laudo?.lotes;
        const codigosProdutos = laudo?.codigoProdutos;
        const qtdCaixasNaoConformes = laudo?.qtdCaixasNaoConformes;

        let tiposNaoConformidadeFormatted = '';

        if (tiposNaoConformidade?.length > 0) {
          tiposNaoConformidadeFormatted = tiposNaoConformidade
            .map(
              (tipo: string) =>
                '- ' +
                tiposNaoConformidadeList?.find(item => item?.value === tipo)
                  ?.label,
            )
            .join('\n');
        } else {
          tiposNaoConformidadeFormatted = 'Sem tipos de não conformidade';
        }

        let lotesFormatted = '';

        if (lotes?.length > 0) {
          lotesFormatted = lotes
            .map((lote: string) => '- ' + lote?.trim())
            .join('\n');
        } else {
          lotesFormatted = 'Sem lotes cadastrados';
        }

        let codigosProdutosFormatted = '';

        if (codigosProdutos?.length > 0) {
          codigosProdutosFormatted = codigosProdutos
            .map((codigoProduto: string) => '- ' + codigoProduto?.trim())
            .join('\n');
        } else {
          codigosProdutosFormatted = 'Sem códigos de produtos cadastrados';
        }

        let qtdCaixasNaoConformesFormatted = '';

        if (qtdCaixasNaoConformes?.length > 0) {
          qtdCaixasNaoConformesFormatted = qtdCaixasNaoConformes
            .map(
              (qtdCaixasNaoConforme: string) =>
                '- ' + qtdCaixasNaoConforme?.trim(),
            )
            .join('\n');
        } else {
          qtdCaixasNaoConformesFormatted =
            'Sem códigos de produtos cadastrados';
        }

        const upOrigem = listaUPsOrigem?.find(
          u => u?.value === laudo?.upOrigem,
        )?.label;
        const cdOrigem = listaCDsOrigem?.find(
          u => u?.value === laudo?.cdOrigem,
        )?.label;

        return {
          ...laudo,
          upOrigem: upOrigem || 'Sem UP de Origem',
          cdOrigem: cdOrigem || 'Sem CD de Origem',
          observacoes: laudo?.observacoes || 'Sem observações',
          tiposNaoConformidade: tiposNaoConformidadeFormatted,
          lotes: lotesFormatted,
          codigoProdutos: codigosProdutosFormatted,
          qtdCaixasNaoConformes: qtdCaixasNaoConformesFormatted,
        };
      });

      return { data: tiposNaoConformidadeFormatted, status };
    }
  }

  return { data, status };
}

export async function getLaudoCrmEvidencesRequest(
  laudoCrmId: string,
  evidenciaId: string,
) {
  const supabase = await createClient();

  const { data } = supabase.storage
    .from('evidencias')
    .getPublicUrl(`laudoCrm/${laudoCrmId}/${evidenciaId}`);

  return { data };
}
