import { User } from '../entities/user.entity';
import { IsUUID, IsNotEmpty, IsString, Matches, IsEmail} from 'class-validator';
import { Password, PasswordRegex } from '../entities/password.entity';

export class GetUserByIdDto {
  @IsUUID()
  readonly id: User['id'];
}

export class UserResponseDto extends User {}
