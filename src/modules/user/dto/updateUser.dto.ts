import { CreateUserDto } from "./createUser.dto";

export interface UpdateUserDto extends Partial<CreateUserDto> {
  profile_visibility?: number;
}