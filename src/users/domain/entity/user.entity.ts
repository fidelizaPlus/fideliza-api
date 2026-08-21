import { Role } from '../enum/user.enum';

export class User {
  constructor(
    readonly id: string,
    readonly authUserId: string,
    readonly name: string,
    readonly email: string,
    readonly createdAt: Date,
    readonly role: Role,
  ) {}
}
