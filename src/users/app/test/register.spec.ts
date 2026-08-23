import { InformPassword } from '@/Error/password-inform';
import { AuthService } from '../service/userAuth.service';
import { InMemoryUserRepository } from './in-memory/in-memory-user-repository';
import { EmailAlreadyExists } from '@/Error/email-already-exists';
import { InformEmail } from '@/Error/email-inform';
import { InvalidPassword } from '@/Error/invalid-password';
import { InvalidPasswordLength } from '@/Error/invalid-password-length';
import { InvalidEmail } from '@/Error/invalid-email';

vi.mock('@/infra/supabase/createClient', () => ({
  supabaseAdmin: {
    auth: {
      admin: {
        createUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: '550e8400-e29b-41d4-a716-446655440000',
            },
          },
          error: null,
        }),

        deleteUser: vi.fn().mockResolvedValue({
          data: {},
          error: null,
        }),
      },
    },
  },
}));

describe('register test', () => {
  let userRepository: InMemoryUserRepository;
  let sut: AuthService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new AuthService(userRepository);
  });

  it('should be able to register a new user', async () => {
    const { user } = await sut.register({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456789',
      passwordConfirmation: '123456789',
    });

    const id = '550e8400-e29b-41d4-a716-446655440000';

    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('johndoe@gmail.com');
    expect(user.authUserId).toBe(id);
    expect(userRepository.items).toHaveLength(1);
  });

  it('should throw UserAlreadyExist if email already exists', async () => {
    const email = 'johndoe@gmail.com';

    await sut.register({
      name: 'John Doe',
      email: email,
      password: '123456789',
      passwordConfirmation: '123456789',
    });

    await expect(
      sut.register({
        name: 'John Doe',
        email: email,
        password: '123456789',
        passwordConfirmation: '123456789',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExists);
  });

  it('should throw InformEmail', async () => {
    await expect(
      sut.register({
        name: 'John Doe',
        email: '',
        password: '123456789',
        passwordConfirmation: '123456789',
      }),
    ).rejects.toBeInstanceOf(InformEmail);
  });

  it('should throw InformPassword', async () => {
    await expect(
      sut.register({
        name: 'Joe Doe',
        email: 'johndoe@gmail.com',
        password: '',
        passwordConfirmation: '',
      }),
    ).rejects.toBeInstanceOf(InformPassword);
  });

  it('should throw InvalidPassword', async () => {
    await expect(
      sut.register({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '123456789',
        passwordConfirmation: '123456780',
      }),
    ).rejects.toBeInstanceOf(InvalidPassword);
  });

  it('should throw InvalidPasswordLength', async () => {
    await expect(
      sut.register({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '12345678',
        passwordConfirmation: '12345678',
      }),
    ).rejects.toBeInstanceOf(InvalidPasswordLength);
  });

  it('should not accept e-mail without "@"', async () => {
    await expect(
      sut.register({
        name: 'John Doe',
        email: 'johndoegmail.com',
        password: '123456789',
        passwordConfirmation: '123456789',
      }),
    ).rejects.toBeInstanceOf(InvalidEmail);
  });

  it('should store the user in the repository after registration', async () => {
    await sut.register({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456789',
      passwordConfirmation: '123456789',
    });

    expect(userRepository.items).toHaveLength(1);
    expect(userRepository.items[0].email).toBe('johndoe@gmail.com');
  });
});
