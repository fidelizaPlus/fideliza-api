import type { Request } from 'express';
import { User } from '@/users/domain/entity/user.entity';

export interface AuthenticatedRequest extends Request {
  user: User;
}
