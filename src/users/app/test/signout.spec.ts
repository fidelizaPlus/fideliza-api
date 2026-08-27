import { Role } from '@/users/domain/enum/user.enum';
import { InMemoryAuthProvider } from './in-memory/in-memory-auth-provider';
import { SignOutService } from '../service/signout.service';

describe('sign out', () => {
  let signoutRepository: InMemoryAuthProvider;
  let sut: SignOutService;
  let accessToken: string;

  beforeEach(async () => {
    signoutRepository = new InMemoryAuthProvider();
    sut = new SignOutService(signoutRepository);

    await signoutRepository.createAuthUser({
      email: 'johndoe@gmail.com',
      password: '123456789',
      name: '',
      role: Role.CLIENT,
    });

    const session = await signoutRepository.signIn({
      email: 'johndoe@gmail.com',
      password: '123456789',
    });

    accessToken = session.accessToken;
  });

  it('should log out an authenticated user', async () => {
    await sut.signout(accessToken);

    expect(signoutRepository.signedOutTokens).toContain(accessToken);
    expect(signoutRepository.signedOutTokens).toHaveLength(1);
  });

  it('should reject the access token after log out', async () => {
    await sut.signout(accessToken);

    const validate = signoutRepository.verifyToken(accessToken);

    await expect(validate).rejects.toBeInstanceOf(Error);
  });
});
