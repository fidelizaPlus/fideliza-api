/* eslint-disable @typescript-eslint/require-await */
import { UserNotFound } from '@/users/app/Error/user-not-found';
import { User } from '@/users/domain/entity/user.entity';
import { CreateUserData, IUserRepository } from '@/users/domain/interface/user.interface';
import { randomUUID } from 'crypto';

export class InMemoryUserRepository implements IUserRepository {
  public items: User[] = [];

  async findUserById(id: string) {
    const user = this.items.find((item) => item.id === id);

    return user ?? null;
  }

  async findUserByAuthUserId(authUserId: string) {
    const user = this.items.find((item) => item.authUserId === authUserId);

    return user ?? null;
  }

  async findUserByName(name: string) {
    const user = this.items.find((item) => item.name === name);

    return user ?? null;
  }

  async findUserByEmail(email: string) {
    const user = this.items.find((item) => item.email === email);

    return user ?? null;
  }

  async deleteUser(id: string) {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) throw new UserNotFound();

    this.items.splice(index, 1);
  }

  async updateUser(user: User) {
    const index = this.items.findIndex((item) => item.id === user.id);

    if (index === -1) throw new UserNotFound();

    this.items[index] = user;

    return user;
  }

  async createUser(data: CreateUserData): Promise<User> {
    const user: User = {
      id: randomUUID(),
      ...data,
      createdAt: new Date(),
    };

    this.items.push(user);

    return user;
  }
}
