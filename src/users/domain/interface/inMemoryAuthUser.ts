import type { Role } from '../enum/user.enum';

export interface InMemoryAuthUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
}
