/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { createClient } from '@/lib/supabase/server';
import { User } from '@/types/user';

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
        permissions: user?.permissions,
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

  const { data, error, status } = await supabase
    .from('users')
    .update({
      name: user?.name,
      email: user?.email,
      profile: user?.profile,
      permissions: user?.permissions,
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

export async function updateUserStatus(userId: string, status: boolean) {
  const supabase = await createClient();

  const {
    data,
    error,
    status: responseStatus,
  } = await supabase
    .from('users')
    .update({
      status: status,
    })
    .eq('id', userId)
    .select();

  if (error) {
    console.error('Error updateUserStatus', JSON.stringify(error, null, 2));
    return null;
  }

  return { data, status: responseStatus };
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
