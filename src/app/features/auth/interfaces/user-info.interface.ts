import { Role } from '@shared/enums/role.enum';

export interface UserInfo {
  name: string | null;
  email: string;
  role: keyof typeof Role;
}
