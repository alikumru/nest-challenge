import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private usersRepository: UserRepository,
  ) {}

  /**
   * @name findAllUsers
   * @description Find all users in the database
   * @returns Array of Users
   */
  async findAllUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  /**
   * @name findUserById
   * @description Find a user by user id
   * @param id
   * @returns User
   */
  async findUserById(id: User['id']): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(
        {
          message: ['User not found'],
          error: `User with id '${id}' does not exist`,
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }
}
