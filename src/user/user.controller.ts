import { Controller, Get, Param, Request,UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetUserByIdDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from './authenticate/guards/jwt-auth.guard';

@Controller()
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  /**
   * @name findAllUsers
   * @description Find All Users
   * @returns Array of User-objects
   */
  @Get('users')
  findAllUsers(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  /**
   * @name findUserById
   * @description Find a user by user id
   * @param params
   * @returns User
   */
  @Get('users/:id')
  findUserById(@Param() params: GetUserByIdDto): Promise<User> {
    const { id } = params;
    try {
      return this.userService.findUserById(id);
    } catch (error) {
      console.error(`findUserById Error: ${error}`);
    }
  }

  /**
   * @name findLoggedinUser
   * @description Get the loggedin user
   * @returns User
   */
  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  findLoggedinUser(@Request() request): string {
    return request.user;
  }
}
