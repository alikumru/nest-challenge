import { Controller, Get, Param,Post, Request,UseGuards, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetUserByIdDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from './authenticate/guards/jwt-auth.guard';
import { UserSignUpDto } from '../dtos/user.signup.dto';

@Controller()
export class UserController {
  constructor(
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

  @Post('user/signup')
  signup(@Body() body: UserSignUpDto, @Request() req): Promise<Object> {
        try {
            return this.userService.createNewUser(body);
        } catch (error) {
            console.error('Error while getting all passwords:',error);
        }
   }
}
