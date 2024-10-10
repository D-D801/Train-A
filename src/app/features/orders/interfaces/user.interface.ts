import { Role } from '@shared/enums/role.enum';

export interface User {
  id: number;
  email: string;
  name: string;
  role: keyof typeof Role;
}
