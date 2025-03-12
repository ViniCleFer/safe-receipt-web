'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

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
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error getAllUsers', JSON.stringify(error, null, 2));
    return null;
  }

  return { data, count, status };
}

export async function getUserByEmail(email: string) {
  const supabase = await createClient();

  const { data, error } = await await supabase
    .from('users')
    .select()
    .eq('email', email);

  if (error) {
    console.error('Error getUserByEmail', JSON.stringify(error, null, 2));
    return null;
  }

  return data[0];
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
    console.error('Error getLaudosCrmRequest', JSON.stringify(data, null, 2));
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

  return { data, status };
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

export async function getCartasControleByIdRequest(cartaControleId: string) {
  const supabase = await createClient();

  const { data, error, status, statusText, count } = await supabase
    .from('cartas-controle')
    .select()
    .eq('id', cartaControleId);

  if (error) {
    console.error(
      'Error getCartasControleByIdRequest',
      JSON.stringify(error, null, 2),
    );
    return null;
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
