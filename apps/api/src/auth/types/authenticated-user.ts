import { UserRole } from "../../common/enums/domain.enums";

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
}
