import { Account } from "./Account";

export interface Session {
  id?: string;
  account?: Account["id"] | Account;

  createdAt: Date;
  updatedAt: Date;
}
