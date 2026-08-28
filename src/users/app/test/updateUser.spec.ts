import { UserNotFound } from '../Error/user-not-found';
import { UpdateUsersService } from '../service/updateUsers.service';
import { InMemoryAuthProvider } from './in-memory/in-memory-auth-provider';
import { InMemoryUserRepository } from './in-memory/in-memory-user-repository';
import type { User } from '@/users/domain/entity/user.entity';
import { Role } from '@/users/domain/enum/user.enum';

describe('update an user', () => {
  let userRepository: InMemoryUserRepository;
  let authProvider: InMemoryAuthProvider;
  let sut: UpdateUsersService;
  let user: User;

  beforeEach(async () => {
    userRepository = new InMemoryUserRepository();
    authProvider = new InMemoryAuthProvider();

    sut = new UpdateUsersService(userRepository, authProvider);

    const authUser = await authProvider.createAuthUser({
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      password: '123456789',
      role: Role.CLIENT,
    });

    user = await userRepository.createUser({
      email: 'johndoe@gmail.com',
      name: 'John Doe',
      role: Role.CLIENT,
      authUserId: authUser.id,
    });
  });

  it('should update user', async () => {
    const updatedUser = await sut.update(user.id, {
      email: 'john@gmail.com',
    });

    expect(updatedUser.email).toBe('john@gmail.com');
  });

  it('should throw an error if id does not exist', async () => {
    await expect(
      sut.update('invalid-id', {
        email: 'john@gmail.com',
      }),
    ).rejects.toBeInstanceOf(UserNotFound);
  });

  it('should persist the updated email in the repository', async () => {
    await sut.update(user.id, {
      email: 'john@gmail.com',
    });

    const storedUser = await userRepository.findUserById(user.id);

    expect(storedUser?.email).toBe('john@gmail.com');
  });

  it('should update the email in the authentication provider', async () => {
    await sut.update(user.id, {
      email: 'john@gmail.com',
    });

    const authUser = authProvider.items.find((item) => item.id === user.authUserId);

    expect(authUser?.email).toBe('john@gmail.com');
  });
});
