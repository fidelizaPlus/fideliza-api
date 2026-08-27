import { InformPassword } from '@/users/app/Error/password-inform';
import { InformEmail } from '@/users/app/Error/email-inform';
import { InvalidPassword } from '@/users/app/Error/invalid-password';
import { InvalidPasswordLength } from '@/users/app/Error/invalid-password-length';
import { InvalidEmail } from '@/users/app/Error/invalid-email';
import { UserAlreadyExist } from '@/users/app/Error/user-already-exist';
import { AuthService } from '../service/userAuth.service';
import { UserService } from '../service/users.service';
import { InMemoryUserRepository } from './in-memory/in-memory-user-repository';
import type { IAuthProvider } from '@/users/domain/interface/authProvider';

describe('register client test', () => {
  let userRepository: InMemoryUserRepository;
  let userService: UserService;
  let authProvider: IAuthProvider;
  let sut: AuthService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    userService = new UserService(userRepository);
    authProvider = {
      createAuthUser: vi.fn().mockResolvedValue({
        id: '550e8400-e29b-41d4-a716-446655440000',
      }),
      deleteAuthUser: vi.fn().mockResolvedValue(undefined),
      signIn: vi.fn(),
      signOut: vi.fn(),
      refreshToken: vi.fn(),
      verifyToken: vi.fn(),
    };
    sut = new AuthService(userService, authProvider);
  });

  it('should be able to register a new client', async () => {
    const { user } = await sut.registerClient({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456789',
      passwordConfirmation: '123456789',
    });

    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('johndoe@gmail.com');
    expect(user.authUserId).toBe('550e8400-e29b-41d4-a716-446655440000');
    expect(userRepository.items).toHaveLength(1);
  });

  it('should throw UserAlreadyExist if email already exists', async () => {
    const email = 'johndoe@gmail.com';

    await sut.registerClient({
      name: 'John Doe',
      email,
      password: '123456789',
      passwordConfirmation: '123456789',
    });

    await expect(
      sut.registerClient({
        name: 'John Doe',
        email,
        password: '123456789',
        passwordConfirmation: '123456789',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExist);
  });

  it('should throw InformEmail', async () => {
    await expect(
      sut.registerClient({
        name: 'John Doe',
        email: '',
        password: '123456789',
        passwordConfirmation: '123456789',
      }),
    ).rejects.toBeInstanceOf(InformEmail);
  });

  it('should throw InformPassword', async () => {
    await expect(
      sut.registerClient({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '',
        passwordConfirmation: '',
      }),
    ).rejects.toBeInstanceOf(InformPassword);
  });

  it('should throw InvalidPassword', async () => {
    await expect(
      sut.registerClient({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '123456789',
        passwordConfirmation: '123456780',
      }),
    ).rejects.toBeInstanceOf(InvalidPassword);
  });

  it('should throw InvalidPasswordLength', async () => {
    await expect(
      sut.registerClient({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '12345678',
        passwordConfirmation: '12345678',
      }),
    ).rejects.toBeInstanceOf(InvalidPasswordLength);
  });

  it('should not accept email without "@"', async () => {
    await expect(
      sut.registerClient({
        name: 'John Doe',
        email: 'johndoegmail.com',
        password: '123456789',
        passwordConfirmation: '123456789',
      }),
    ).rejects.toBeInstanceOf(InvalidEmail);
  });

  it('should store the client in the repository after registration', async () => {
    await sut.registerClient({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456789',
      passwordConfirmation: '123456789',
    });

    expect(userRepository.items).toHaveLength(1);
    expect(userRepository.items[0].email).toBe('johndoe@gmail.com');
  });
});
