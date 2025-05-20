import type { ERole } from "../enums/ERole";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: ERole
}

export interface User {
  id: string;
 firstname: string;
  lastname: string;
  email: string;
  role: ERole;
  token: string;
}
