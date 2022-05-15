import { HttpException, HttpStatus,Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordRepository } from '../repositories/password.repository';
import { UserRepository } from '../repositories/user.repository';
import { getCustomRepository } from 'typeorm';
import { ChangePasswordDto } from '../dtos/password.dto';

@Injectable()
export class PasswordService {

    constructor(
        @InjectRepository(PasswordRepository)
        private passwordRepository: PasswordRepository,
    ) { }

    async changeUserPassword(changePasswordDto: ChangePasswordDto, userId: User['id']): Promise<boolean> {

        // 1. Check new password and confirm password equality
        if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
          console.error('passwords does not match')
        }
    
        // 1. Get passwords from user table with relation
        const userRepo = getCustomRepository(UserRepository)
        const user = await userRepo.manager.findOne(User, {
          where: [{ id: userId }],
          relations: ['passwords'],
        });

        // Throw error if user does not have any passwords
        if (!user.passwords) {
          // throw error
        }
    
        // Check user's last three passwords, new password can not be same as last three passwords
        const isMatchedLastThreePasswords = await this.passwordRepository.checkLastThreePasswords(changePasswordDto.newPassword, user);
        if (isMatchedLastThreePasswords) {
          //throw error
        }
    
        // Change password
        return await this.passwordRepository.changePassword(changePasswordDto, user);
      }
    
      async getAllPasswords(user: User): Promise<Object> {
        return await this.passwordRepository.getUserPasswords(user);
      }

    }


    