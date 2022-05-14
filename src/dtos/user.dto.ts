import { User } from '../entities/user.entity';
import { IsUUID } from 'class-validator';

export class GetUserByIdDto {
  @IsUUID()
  readonly id: User['id'];
}

export class UserResponseDto extends User {}
