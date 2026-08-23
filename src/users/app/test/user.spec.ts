import { randomUUID } from 'crypto';
import { UserService } from '../service/users.service';
import { InMemoryUserRepository } from './in-memory/in-memory-user-repository';
import { Role } from '@/users/domain/enum/user.enum';

describe('User test', () => {
  let userRepository: InMemoryUserRepository;
  let sut: UserService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    sut = new UserService(userRepository);
  });

  it('should create an manager', async () => {
    const authUserId = randomUUID();

    const user = await sut.createManager({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId,
    });

    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('johndoe@gmail.com');
    expect(user.authUserId).toBe(authUserId);
    expect(user.role).toBe(Role.MANAGER);
    expect(userRepository.items).toHaveLength(1);
  });

  it('should create an client', async () => {
    const authUserId = randomUUID();

    const user = await sut.createClient({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      authUserId,
    });

    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('johndoe@gmail.com');
    expect(user.authUserId).toBe(authUserId);
    expect(user.role).toBe(Role.CLIENT);
    expect(userRepository.items).toHaveLength(1);
  });

  it('should create an user', async () => {
    const authUserId = randomUUID();

    const user = await sut.createUser(
      {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        authUserId,
      },
      Role.CLIENT,
    );

    expect(user.role).toBe(Role.CLIENT);
  });
});
