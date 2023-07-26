import { Profile } from '@components/profile/interfaces/Profile';

import { AccountStatusType } from './AccountStatusType';
import { ExternalAuthType } from './ExternalAuthType';
import { Session } from './Session';

export interface Account {
  id: string;
  email: string;
  password: string;
  salt: string;
  externalAuthType?: ExternalAuthType['type'] | ExternalAuthType;
  externalId?: string;
  status: AccountStatusType['status'] | AccountStatusType;
  sessions?: Session['id'][] | Session[];
  profiles?: Profile['id'][] | Profile[];

  createdAt: string;
  updatedAt: string;
}

export type SecuredAccount = Omit<Account, 'password' | 'salt'>;
