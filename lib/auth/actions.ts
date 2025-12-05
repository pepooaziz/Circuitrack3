'use server';

import { createClient } from '../supabase/server';
import { redirect } from 'next/navigation';

export async function signUp(email: string, password: string, role: 'VENDOR' | 'CUSTOMER' = 'CUSTOMER') {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error('Failed to create user');
  }

  const { error: userError } = await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      email,
      role,
    });

  if (userError) {
    throw new Error(userError.message);
  }

  return { success: true };
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
