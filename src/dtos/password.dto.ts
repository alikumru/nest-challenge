import { IsString, IsNotEmpty, Matches,IsIn } from 'class-validator';
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
  
export class ChangeAlgorithmDto {

  @IsNotEmpty()
  @IsString()
  @IsIn(['bcrypt', 'scrypt','argon2id'],
  {message:'Please enter a valid hashing algorithm'} )
  public algorithm!: string;
}