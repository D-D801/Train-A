import { Role } from '@shared/enums/role.enum';

export interface UserInformation {
  name: string | null;
  email: string;
  role: keyof typeof Role;
}
