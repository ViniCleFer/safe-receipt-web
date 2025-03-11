export enum TipoPerfil {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  name: string;
  email: string;
  profile: TipoPerfil;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  canceled_at: Date | null;
}
