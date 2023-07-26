import { Account } from '@components/account/interfaces/Account';
import { Profile } from '@components/profile/interfaces/Profile';

export interface SignUp extends Account, Pick<Profile, 'name' | 'lastName'> {
  passwordConfirmation: string;
}
