import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { UserException } from '../exception/user.exception';
import { UserSignUpDto } from '../dtos/user.signup.dto';

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
      throw new UserException(`User with id '${id}' does not exist`, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async createNewUser(user: UserSignUpDto): Promise<User> {
    const createdUser = this.usersRepository.createNewUser(user,user.password)
    if(!createdUser){
      throw new UserException('Error during signup process',HttpStatus.BAD_REQUEST)
    }
    return user;   
  }
}
