'use server';

import { createClient } from '@/lib/supabase/server';

export async function getSession() {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getSession', error);
    // redirect('/error');
    return null;
  }
  return data;
}

export async function getUser() {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error getSession', error);
    // redirect('/error');
    return null;
  }

  return data?.user;
}
