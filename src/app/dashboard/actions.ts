/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { tiposNaoConformidade as tiposNaoConformidadeList } from '@/utils/tiposNaoConformidade';
import { listaCDsOrigem, listaUPsOrigem } from '@/utils/listaUPs';
import { User } from '@/types/user';
import { listaTurnos } from '@/utils/listaTurnos';

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error logging out', error);
    // redirect('/error');
    return null;
  }

  console.log('Logged out successfully');

  revalidatePath('/login', 'layout');
  redirect('/login');
}

export async function getAllUsers() {
  const supabase = await createClient();

  const { data, error, status, count } = await supabase
    .from('users')
    .select()
    .order('name', { ascending: true });

  if (error) {
    console.error('Error getAllUsers', JSON.stringify(error, null, 2));
    return null;
  }

  return { data, count, status };
}

export async function getUserByEmail(email: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error getUserByEmail', JSON.stringify(error, null, 2));
    return { data: null, error };
  }

  console.log('Success getUserByEmail', JSON.stringify(data, null, 2));

  return { data, error: null };
}

export async function revalidateDashboard() {
  revalidatePath('/dashboard', 'layout');
  redirect('/dashboard');
}

export async function createUser(user: any) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: user.email!,
    password: user.password!,
    options: {
      data: {
        name: user?.name,
        status: true,
        profile: user?.profile,
      },
    },
  });

  if (error) {
    console.error('Error createUser', JSON.stringify(error, null, 2));
    return null;
  }

  const response = await getAllUsers();

  return {
    data: response?.data,
    status: response?.status,
    count: response?.count,
  };
}

export async function updateUser(user: Partial<User>) {
  const supabase = await createClient();

  // const { data, error } = await supabase.auth.updateUser({
  //   email: user?.email,
  //   data: {
  //     name: user?.name,
  //     email: user?.email,
  //     profile: user?.profile,
  //     status: user?.status,
  //   },
  // });

  // if (dataError) {
  //   console.error('Error updateUser', JSON.stringify(dataError, null, 2));
  //   return null;
  // }

  const { data, error, status } = await supabase
    .from('users')
    .update({
      name: user?.name,
      email: user?.email,
      profile: user?.profile,
      status: user?.status,
    })
    .eq('id', user?.id)
    .select();

  if (error) {
    console.error('Error updateUser', JSON.stringify(error, null, 2));
    return null;
  }

  return { data, status };
}

export async function deleteUser(userId: string) {
  const supabase = await createClient();

  const { data, error, status } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) {
    console.error('Error deleteUser', JSON.stringify(error, null, 2));
    return null;
  }

  return { data, status };
}

export async function getAllFormsPtp() {
  const supabase = await createClient();

  const { data, error, status, count } = await supabase
    .from('forms-ptp')
    .select()
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error getAllFormsPtp', JSON.stringify(error, null, 2));
    return null;
  }

  return { data, count, status };
}

export async function getAllFormsPtpAnswerWithFormPtpRelationship() {
  const supabase = await createClient();

  const { data, error, status, count } = await supabase
    .from('forms-ptp-answers')
    .select(
      `
      *,
      form_ptp: forms-ptp (*),
      enunciado: enunciados (*)
    `,
    );

  if (error) {
    console.error(
      'Error getAllFormsPtpAnswerWithFormPtpRelationship',
      JSON.stringify(data, null, 2),
    );
    return null;
  }

  return { data, status, count };
}

export async function getDetailsFormPtpById(idFormPtp: string) {
  const supabase = await createClient();

  const { data, error, status, count } = await supabase
    .from('forms-ptp')
    .select()
    .eq('id', idFormPtp);

  if (error) {
    console.error(
      'Error getDetailsFormPtpById',
      JSON.stringify(error, null, 2),
    );
    return null;
  }

  return { data, status, count };
}

export async function getFormPtpAnswersRequest() {
  const supabase = await createClient();

  const { data, error, status, count } = await supabase
    .from('forms-ptp-answers')
    .select();

  if (error) {
    console.error(
      'Error getFormPtpAnswersRequest',
      JSON.stringify(data, null, 2),
    );
    return null;
  }

  return { data, status, count };
}

export async function getFormsPtpAnswerByFormPtpIdRequest(idFormPtp: string) {
  const supabase = await createClient();

  const { data, error, status, statusText, count } = await supabase
    .from('forms-ptp-answers')
    .select()
    .eq('form_ptp_id', idFormPtp);

  if (error) {
    console.error(
      'Error getFormsPtpAnswerByFormPtpIdRequest',
      JSON.stringify(error, null, 2),
    );
    return null;
  }

  console.log(
    'Success getFormsPtpAnswerByFormPtpIdRequest',
    JSON.stringify(
      {
        data,
        status,
        statusText,
        count,
      },
      null,
      2,
    ),
  );

  return { data, status, count };
}

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

export async function getLaudosCrmByFormPtpIdRequest(idFormPtp: string) {
  const supabase = await createClient();

  const { data, error, status, statusText, count } = await supabase
    .from('laudos-crm')
    .select()
    .eq('form-ptp-id', idFormPtp);

  if (error) {
    console.error(
      'Error getLaudosCrmByFormPtpIdRequest',
      JSON.stringify(error, null, 2),
    );
    return null;
  }

  console.log(
    'Success getLaudosCrmByFormPtpIdRequest',
    JSON.stringify(
      {
        data,
        status,
        statusText,
        count,
      },
      null,
      2,
    ),
  );

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
            const { data: dataStorage } = supabase.storage
              .from('evidencias')
              .getPublicUrl(`laudoCrm/${laudoCrm?.id}/${evidenciaId}`);

            const evidencia = dataStorage?.publicUrl;

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
          codigosProdutos: codigosProdutosFormatted,
          qtdCaixasNaoConformes: qtdCaixasNaoConformesFormatted,
        };
      });

      console.log(
        'laudosCrm => ',
        JSON.stringify(tiposNaoConformidadeFormatted[0], null, 2),
      );

      return { data: tiposNaoConformidadeFormatted, status };
    }
  }
}

export async function getLaudosCrmByIdRequest(laudoCrmId: string) {
  const supabase = await createClient();

  const { data, error, status, statusText, count } = await supabase
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
          codigosProdutos: codigosProdutosFormatted,
          qtdCaixasNaoConformes: qtdCaixasNaoConformesFormatted,
        };
      });

      console.log(
        'laudosCrm => ',
        JSON.stringify(tiposNaoConformidadeFormatted[0], null, 2),
      );

      return { data: tiposNaoConformidadeFormatted, status };
    }
  }

  console.log(
    'Success getLaudosCrmByIdRequest',
    JSON.stringify(
      {
        data,
        status,
        statusText,
        count,
      },
      null,
      2,
    ),
  );

  return { data, status, count };
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

export async function getDivergencesRequest() {
  const supabase = await createClient();

  const { data, error, status } = await supabase
    .from('divergencias')
    .select()
    .order('created_at', { ascending: false });

  if (error) {
    console.error(
      'Error getDivergencesRequest',
      JSON.stringify(error, null, 2),
    );
    return null;
  }

  return { data, status };
}

export async function getDetailsDivergenceByIdRequest(idDivergencia: string) {
  const supabase = await createClient();

  const { data, error, status, statusText, count } = await supabase
    .from('divergencias')
    .select()
    .eq('id', idDivergencia);

  if (error) {
    console.error(
      'Error getDetailsDivergenceByIdRequest',
      JSON.stringify(error, null, 2),
    );
    return null;
  }

  console.log(
    'Success getDetailsDivergenceByIdRequest',
    JSON.stringify(
      {
        data,
        status,
        statusText,
        count,
      },
      null,
      2,
    ),
  );

  return { data, status };
}

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

export async function getCartasControleByIdRequest(cartaControleId: string) {
  const supabase = await createClient();

  const { data, error, status, statusText, count } = await supabase
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

      console.log(
        'cartaControleFormatada => ',
        JSON.stringify(cartaControleFormatada[0], null, 2),
      );

      return { data: cartaControleFormatada, status };
    }
  }

  console.log(
    'Success getCartasControleByIdRequest',
    JSON.stringify(
      {
        data,
        status,
        statusText,
        count,
      },
      null,
      2,
    ),
  );

  return { data, status };
}
