import { Permission } from '@/types/user';

export function getPermissions(permissions: Permission[]) {
  const permissionsMapped = permissions?.map(permission => {
    return permission.toLowerCase();
  });

  return permissionsMapped?.join(', ') || 'Nenhuma permissão definida';
}
