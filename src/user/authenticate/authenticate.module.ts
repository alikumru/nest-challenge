import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticateController } from './authenticate.controller';
import { AuthenticateService } from './authenticate.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from '../../repositories/user.repository';
import { JwtModule } from '@nestjs/jwt';
import * as jwtUtils from '../../utils/jwt.util';
import { UserService } from '../user.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserRepository]),
    UserRepository,
    JwtModule.register({
      secret: jwtUtils.DEFAULT_JWT_SECRET_STRING,
      signOptions: { expiresIn: jwtUtils.DEFAULT_EXPIRY_TIME },
    }),
  ],
  controllers: [AuthenticateController],
  providers: [AuthenticateService,UserService, JwtStrategy],
  exports: [AuthenticateService]
})
export class AuthenticateModule {}
