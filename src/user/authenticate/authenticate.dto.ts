import { IsNotEmpty } from 'class-validator';

export class AuthenticateUserByPasswordRequestDTO {
  @IsNotEmpty()
  username!: string;

  @IsNotEmpty()
  password: string;
}
