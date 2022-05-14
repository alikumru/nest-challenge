import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { signToken } from '../../utils/jwt.util';
import { User } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class AuthenticateService {
  constructor(
    @InjectRepository(UserRepository)
    private usersRepository: UserRepository,
  ) {}

  async authenticateUser(
    username: User['email'],
    password: string,
  ): Promise<string> {
    try {
      const user = await this.usersRepository.authenticateUser(
        username,
        password,
      );
      if (user) {
        return await signToken(user);
      } else {
        throw new Error('AUTHENTICATION_ERROR');
      }
    } catch (error) {
      throw new Error('AUTHENTICATION_ERROR');
    }
  }
}
