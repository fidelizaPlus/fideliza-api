import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTH_PROVIDER } from '@/users/domain/interface/authProvider';
import type { AuthenticatedUser, IAuthProvider } from '@/users/domain/interface/authProvider';
import { USER_REPOSITORY } from '@/users/domain/interface/user.interface';
import type { IUserRepository } from '@/users/domain/interface/user.interface';
import type { AuthenticatedRequest } from '../../interfaces/authenticatedRequest.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(AUTH_PROVIDER)
    private readonly authProvider: IAuthProvider,

    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Token not provided');
    }

    const [type, token] = authorization.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }

    let authenticatedUser: AuthenticatedUser;

    try {
      authenticatedUser = await this.authProvider.verifyToken(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userRepository.findUserByAuthUserId(authenticatedUser.authUserId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    request.user = user;

    return true;
  }
}
