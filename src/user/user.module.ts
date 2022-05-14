import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from './user.service';
import { AuthenticateModule } from './authenticate/authenticate.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([UserRepository]),
    UserRepository,
    AuthenticateModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
