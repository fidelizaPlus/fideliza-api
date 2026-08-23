import type { User } from '../entity/user.entity';
import type { Role } from '../enum/user.enum';

export interface CreateUserData {
  name: string;
  email: string;
  authUserId: string;
  role: Role;
}

export interface IUserRepository {
  createUser(data: CreateUserData): Promise<User>;
  findUserById(id: string): Promise<User | null>;
  findUserByAuthUserId(authUserId: string): Promise<User | null>;
  findUserByName(name: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  deleteUser(id: string): Promise<void>;
  updateUser(user: User): Promise<User>;
}

// Injection Token
export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
