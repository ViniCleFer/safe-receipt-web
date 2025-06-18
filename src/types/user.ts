export enum TipoPerfil {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
}

export enum Permission {
  MOBILE = 'MOBILE',
  WEB = 'WEB',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  profile: TipoPerfil;
  permissions: Permission[];
  status: boolean;
  created_at: Date;
  updated_at: Date;
  canceled_at: Date | null;
}
