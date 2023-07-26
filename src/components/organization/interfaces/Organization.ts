import { Profile } from '@components/profile/interfaces/Profile';

export interface Organization {
  id: string;
  name: string;
  collaborators?: Profile[];

  createdAt: Date;
  updatedAt: Date;
}
