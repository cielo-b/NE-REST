import { ERole } from "../../../enums/user-role.enum";

export class RegisterUserDto {
  firstname!: string;
  lastname!: string;
  password!: string;
  role?: ERole = ERole.ATTENDANT;
  email!: string;
}