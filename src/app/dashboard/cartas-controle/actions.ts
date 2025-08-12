/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { createClient } from '@/lib/supabase/server';
import { listaTurnos } from '@/utils/listaTurnos';

export async function getCartasControleRequest() {
  const supabase = await createClient();

  const { data, error, status } = await supabase
    .from('cartas-controle')
    .select()
    .order('created_at', { ascending: false });

  if (error) {
    console.error(
      'Error getCartasControleRequest',
      JSON.stringify(error, null, 2),
    );
    return null;
  }

  return { data, status };
}

export async function getCartasControleByIdRequest(cartaControleId: string) {
  const supabase = await createClient();

  const { data, error, status } = await supabase
    .from('cartas-controle')
    .select(
      `
    *,
    users:users(*)
  `,
    )
    .eq('id', cartaControleId);

  if (error) {
    console.error(
      'Error getCartasControleByIdRequest',
      JSON.stringify(error, null, 2),
    );
    return null;
  }

  if (status === 200) {
    let cartasControle: any[] = [];

    if (data?.length === 1) {
      for await (const cartaControle of data as any[]) {
        const evidencias = cartaControle?.evidencias;

        let urlsEvidencias: any[] = [];

        if (evidencias?.length === 0) {
          urlsEvidencias = [];
        } else {
          for await (const evidenciaId of evidencias) {
            const { data } = await getCartaControleEvidencesRequest(
              cartaControle?.id,
              evidenciaId,
            );

            const evidencia = data?.publicUrl;

            if (evidencia) {
              const grupo = evidenciaId.split('/')[0];

              urlsEvidencias = [
                ...urlsEvidencias,
                { url: evidencia, tipo: evidenciaId, grupo },
              ];
            } else {
              urlsEvidencias = [...urlsEvidencias];
            }
          }
        }

        cartasControle = [
          ...cartasControle,
          {
            ...cartaControle,
            evidencias: [...urlsEvidencias],
          },
        ];
      }

      const groupImagesByType = (images: any) => {
        return images.reduce((acc: any, image: any) => {
          const existingGroup = acc.find(
            (group: any) => group.grupo === image.grupo,
          );

          if (existingGroup) {
            existingGroup.data.push(image);
          } else {
            acc.push({ grupo: image?.grupo, data: [image] });
          }

          return acc;
        }, []);
      };

      const cartaControleFormatada = cartasControle?.map(cartaControle => {
        const turno = listaTurnos?.find(
          u => u?.value === cartaControle?.turno,
        )?.label;

        const evidencias = groupImagesByType(cartaControle?.evidencias);

        return {
          ...cartaControle,
          turno: turno,
          evidencias,
        };
      });

      return { data: cartaControleFormatada, status };
    }
  }

  return { data, status };
}

export async function getCartaControleEvidencesRequest(
  cartaControleId: string,
  evidenciaId: string,
) {
  const supabase = await createClient();

  const { data } = supabase.storage
    .from('evidencias')
    .getPublicUrl(`carta-controle/${cartaControleId}/${evidenciaId}`);

  return { data };
}
