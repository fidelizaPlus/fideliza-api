import { User as DomainUser } from '../domain/entity/user.entity';
import { Role } from '../domain/enum/user.enum';
import type { User as PrismaUser } from 'generated/prisma/client';

export class UserMapper {
  static toDomain(user: PrismaUser): DomainUser {
    return new DomainUser(
      user.id,
      user.authUserId,
      user.name,
      user.email,
      user.createdAt,
      Role[user.role],
    );
  }
}
