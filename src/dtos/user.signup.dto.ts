import { EmailRegex, User } from '../entities/user.entity';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Password } from '../entities/password.entity';
import { PasswordRegex } from '../constants/app.constants';

export class UserSignUpDto {
  
    @IsNotEmpty()
    @IsString()
    @Matches(EmailRegex)
    public email!: User['email'];
  
    @IsNotEmpty()
    @IsString()
    public name!: User['name'];
  
    @IsNotEmpty()
    @IsString()
    @Matches(PasswordRegex, {
      message: `Password is not valid. Please enter a valid password`,
    })
    public password!: Password['password'];
  
    @IsNotEmpty()
    @IsString()
    @Matches(PasswordRegex, {
      message: `Password is not valid. Please enter a valid password`,
    })
    public confirmPassword: string;
}