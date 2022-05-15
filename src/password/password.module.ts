import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordRepository } from '../repositories/password.repository';
import { UserRepository } from '../repositories/user.repository';
import { PasswordController } from './password.controller';
import { PasswordService } from './password.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([PasswordRepository]),
    PasswordRepository,
    TypeOrmModule.forFeature([UserRepository]),
    UserRepository
 ],
  controllers: [PasswordController],
  providers: [PasswordService],
})
export class PasswordModule {}
