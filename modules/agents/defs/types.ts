import { CrudObject, Id } from "@/common/defs/types";
import { Language, User } from "@/modules/users/defs/types";

export interface Agent extends CrudObject {
  licenseNumber: string;
  experience: string;
  bio: string;
  agencyName: string;
  agencyAddress: string;
  userId: Id;
  user: User;
  languages: Language[];
}
