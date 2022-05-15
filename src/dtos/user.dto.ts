import { User } from '../entities/user.entity';
import { IsUUID, IsNotEmpty, IsString, Matches, IsEmail} from 'class-validator';
import { Password, PasswordRegex } from '../entities/password.entity';

export class GetUserByIdDto {
  @IsUUID()
  readonly id: User['id'];
}

export class UserSignupDto {
  
  @IsNotEmpty()
  @IsString()
  public name!: User['name'];

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email!: User['email'];

  @IsNotEmpty()
  @IsString()
  @Matches(/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,128})/, {
    message: `The password doesn't meet the requirements`,
  })
  public password!: Password['password'];

  @IsNotEmpty()
  @IsString()
  @Matches(/^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,128})/, {
    message: `The password doesn't meet the requirements`,
  })
  public confirmPassword: string;
}

export class UserResponseDto extends User {}
