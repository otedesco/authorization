import { Transaction } from "objection";

import { Profile } from "../interfaces/Profile";
import Profiles from "../models/ProfileModel";

async function create(profile: Partial<Profile>, tx?: Transaction) {
  return Profiles.query(tx).insert(profile);
}

export default { create };
