import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { PasswordRegex } from '../constants/app.constants';

export class ChangePasswordDto {

    @IsNotEmpty()
    @IsString()
    @Matches(PasswordRegex, {
      message: `Password is not valid. Please enter a valid password`,
    })
    public newPassword!: string;
  
    @IsNotEmpty()
    @IsString()
    @Matches(PasswordRegex, {
      message: `Password is not valid. Please enter a valid password`,
    })
    public confirmPassword!: string;
}
  