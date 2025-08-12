'use server';

import { createClient } from '@/lib/supabase/server';

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
