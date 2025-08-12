'use server';

import { createClient } from '@/lib/supabase/server';

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

export async function getFormPtpById(id: string) {
  const supabase = await createClient();

  const { data, error, status } = await supabase
    .from('forms-ptp')
    .select()
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error getFormPtpById', JSON.stringify(error, null, 2));
    return null;
  }

  return { data, status };
}
