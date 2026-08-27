import { Role } from '@/users/domain/enum/user.enum';
import { DeleteUserService } from '../service/deleteUser.service';
import { InMemoryUserRepository } from './in-memory/in-memory-user-repository';
import { UserNotFound } from '../Error/user-not-found';

const { deleteUserMock } = vi.hoisted(() => ({
  deleteUserMock: vi.fn(),
}));

vi.mock('@/infra/supabase/createClient', () => ({
  supabaseAdmin: {
    auth: {
      admin: {
        deleteUser: deleteUserMock,
      },
    },
  },
}));

describe('delete user', () => {
  let userRepository: InMemoryUserRepository;
  let sut: DeleteUserService;

  beforeEach(() => {
    vi.clearAllMocks();

    deleteUserMock.mockResolvedValue({
      data: {},
      error: null,
    });

    userRepository = new InMemoryUserRepository();
    sut = new DeleteUserService(userRepository, {
      deleteAuthUser: deleteUserMock,
    } as unknown as ConstructorParameters<typeof DeleteUserService>[1]);
  });

  it('should delete an existing user', async () => {
    const user = await userRepository.createUser({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId: 'auth-user-1',
      role: Role.CLIENT,
    });

    await sut.delete(user.id, Role.CLIENT);

    expect(userRepository.items).toHaveLength(0);
    expect(deleteUserMock).toHaveBeenCalledWith(user.authUserId);
  });

  it('should throw UserNotFound when user ID does not exist', async () => {
    await expect(sut.delete('non-existent-user-id', Role.CLIENT)).rejects.toBeInstanceOf(
      UserNotFound,
    );
  });

  it('should not affect other users when deleting one', async () => {
    userRepository.items.push(
      {
        id: 'user-1',
        authUserId: 'auth-user-1',
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        createdAt: new Date(),
        role: Role.CLIENT,
      },
      {
        id: 'user-2',
        authUserId: 'auth-user-2',
        name: 'Jane Doe',
        email: 'janedoe@gmail.com',
        createdAt: new Date(),
        role: Role.MANAGER,
      },
    );

    await sut.delete('user-1', Role.CLIENT);

    expect(userRepository.items).toHaveLength(1);
    expect(userRepository.items[0].id).toBe('user-2');

    expect(deleteUserMock).toHaveBeenCalledOnce();
    expect(deleteUserMock).toHaveBeenCalledWith('auth-user-1');
  });
});
