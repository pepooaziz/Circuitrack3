import { createClient } from '../supabase/server';

export type UserRole = 'ADMIN' | 'VENDOR' | 'CUSTOMER';

export interface CurrentUser {
  id: string;
  email: string;
  role: UserRole;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const { data: userData } = await supabase
    .from('users')
    .select('id, email, role')
    .eq('id', user.id)
    .maybeSingle();

  if (!userData) {
    return null;
  }

  return {
    id: userData.id,
    email: userData.email,
    role: userData.role as UserRole
  };
}

export async function requireAuth(allowedRoles?: UserRole[]) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error('Forbidden');
  }

  return user;
}

export async function getVendorByUserId(userId: string) {
  const supabase = await createClient();

  const { data: vendor } = await supabase
    .from('vendors')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  return vendor;
}
