import { Account } from '../../account/interfaces/Account';

export type SignIn = Pick<Account, 'email' | 'password'>;
