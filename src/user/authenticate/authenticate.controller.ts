import { AuthenticateService } from './authenticate.service';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthenticateUserByPasswordRequestDTO } from './authenticate.dto';
import { ConfigService } from '@nestjs/config';
import { Response_AuthToken } from '../../model/auth.token.response';

@Controller('authenticate')
export class AuthenticateController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authenticateService: AuthenticateService,
  ) {}

  /**
   * @name AuthenticateUser
   * @description Authenticate a User with a user and password
   * @returns boolean
   */
  @Post()
  @HttpCode(200)
  async AuthenticateUser(
    @Body() body: AuthenticateUserByPasswordRequestDTO,
  ): Promise<Response_AuthToken> {
    const { username, password } = body;
    try {
      const token = await this.authenticateService.authenticateUser(
        username,
        password,
      );
      console.log('token: ', token);
      return {
        access_token: token 
      };
    } catch (error) {
      console.log('AuthenticateUser Error: ', error);
      return {
        code: 401,
        message: error.message
      };
    }
  }
}
