'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

interface FormData {
  email: string;
  password: string;
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email,
    password: formData.password,
  };

  const {
    error,
    data: { session },
  } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error('Error signing up:', error);
    // redirect('/error');
    return { error, session: null };
  }

  return { error: null, session };
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email,
    password: formData.password,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error('Error signing up:', error);
    // redirect('/error');
  }

  revalidatePath('/dashboard', 'layout');
  redirect('/dashboard/forms-ptp');
}
