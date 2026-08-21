import { PrismaService } from '@/shared/prisma/prisma.service';
import type { CreateUserData, IUserRepository } from '../domain/interface/user.interface';
import { Injectable } from '@nestjs/common';
import { User as DomainUser } from '../domain/entity/user.entity';
import { UserMapper } from '../mapper/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserData): Promise<DomainUser> {
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        authUserId: data.authUserId,
        role: data.role,
      },
    });

    return UserMapper.toDomain(user);
  }

  async findUserById(id: string): Promise<DomainUser | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async findUserByAuthUserId(authUserId: string): Promise<DomainUser | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        authUserId,
      },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async findUserByName(name: string): Promise<DomainUser | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        name,
      },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async findUserByEmail(email: string): Promise<DomainUser | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async deleteUser(id: string) {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async updateUser(user: DomainUser): Promise<DomainUser> {
    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    return UserMapper.toDomain(updatedUser);
  }
}
