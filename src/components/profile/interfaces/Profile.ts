import { Account } from "@components/account/interfaces/Account";
import { Organization } from "@components/organization/interfaces/Organization";

import { ProfileType } from "./ProfileType";
import { RoleType } from "./RoleType";

export interface Profile {
  id?: string;
  name: string;
  lastName: string;
  avatarUrl?: string;

  role: RoleType["role"] | RoleType;
  type: ProfileType["type"] | ProfileType;

  account: Account["id"] | Account;
  organization?: Organization["id"] | Organization;

  createdAt?: Date;
  updatedAt?: Date;
}
