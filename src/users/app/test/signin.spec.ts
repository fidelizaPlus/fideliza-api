import { Role } from '@/users/domain/enum/user.enum';
import { SignInService } from '../service/signin.service';
import { InMemoryAuthProvider } from './in-memory/in-memory-auth-provider';
import { FailedSignIn } from '../Error/failed-signIn';

describe('sign in', () => {
  let signinRepository: InMemoryAuthProvider;
  let sut: SignInService;

  beforeEach(() => {
    signinRepository = new InMemoryAuthProvider();
    sut = new SignInService(signinRepository);
  });

  it('should sign in an user', async () => {
    const user = await signinRepository.createAuthUser({
      email: 'johndoe@gmail.com',
      password: '123456789',
      name: 'John Doe',
      role: Role.CLIENT,
    });

    //sign in
    const session = await sut.signin({
      email: 'johndoe@gmail.com',
      password: '123456789',
    });

    expect(session.user.id).toBe(user.id);
    expect(session.user.email).toBe('johndoe@gmail.com');

    expect(session.accessToken).toEqual(expect.any(String));
    expect(session.accessToken).not.toHaveLength(0);

    expect(session.refreshToken).toEqual(expect.any(String));
    expect(session.refreshToken).not.toHaveLength(0);

    expect(session.expiresIn).toBe(3600);
  });

  it('should not sign in with wrong password', async () => {
    await signinRepository.createAuthUser({
      email: 'johndoe@gmail.com',
      password: '123456789',
      name: 'John Doe',
      role: Role.CLIENT,
    });

    //sign in
    await expect(
      sut.signin({
        email: 'johndoe@gmail.com',
        password: '123456780',
      }),
    ).rejects.toBeInstanceOf(FailedSignIn);
  });

  it('should not sign in with wrong e-mail', async () => {
    await signinRepository.createAuthUser({
      email: 'johndoe@gmail.com',
      password: '123456789',
      name: 'John Doe',
      role: Role.CLIENT,
    });

    //sign in
    await expect(
      sut.signin({
        email: 'john@gmail.com',
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(FailedSignIn);
  });

  it('hould not sign in when the user does not exist', async () => {
    await expect(
      sut.signin({
        email: 'unknown@gmail.com',
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(FailedSignIn);

    expect(signinRepository.sessions).toHaveLength(0);
  });
});
