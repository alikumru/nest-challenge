import { v4 as uuidv4 } from 'uuid';
import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import {
  Password,
  PasswordStatus,
  PASSWORD_HASH_ALGORIHTM,
} from '../entities/password.entity';
import { User } from '../entities/user.entity';
import { PasswordRepository } from './password.repository';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async createNewUser(
    user: Partial<User>,
    password?: string,
  ): Promise<User> {
    // Create a new user objects
    const newUser = this.manager.create(User, user);
    // Get the custom password respository
    const passwordRepo = getCustomRepository(PasswordRepository);
    // Hash the new password for all algorithms
    const passwords: Password[] = [];
    // Create a correlationId to assign to all password objects for grouping
    const correlationId = uuidv4();

    // Check if a passqord was provided
    if (password) {
      // Create a password object for each of the password hashing algorithms
      for (const key in PASSWORD_HASH_ALGORIHTM) {
        const passwordObj = await passwordRepo.createPasswordObject(
          password,
          PASSWORD_HASH_ALGORIHTM[key],
        );
        // Add the password to the passwords array
        passwords.push(
          passwordRepo.create({
            ...passwordObj,
            correlation_id: correlationId,
          }),
        );
      }
      // Add the password objects to the user object
      newUser.passwords = [...passwords];
    }

    // Save the new user object
    try {
      return await this.manager.save(newUser);
    } catch (error) {
      console.error(`Error createNewUser: ${error}`);
      throw new Error(error);
    }
  }

  /**
   * @name authenticateUser
   * @description Authenticate a user
   * @param username
   * @param password
   * @returns boolean
   */
  public async authenticateUser(
    username: User['email'],
    password: string,
  ): Promise<User> {
    const user = await this.manager.findOne(User, {
      where: [{ email: username }],
      relations: ['passwords'],
    });

    // Check if the user account is active
    if (!user.active) {
      throw new Error('USER_NOT_ACTIVE');
    }

    // Get the active Password object
    const passwordObj = user.passwords.find(
      (item) => item.status === PasswordStatus.ACTIVE,
    );

    // Verify the password
    const passwordRepo = getCustomRepository(PasswordRepository);
    const passwordVerify = await passwordRepo.verifyPassword(
      password,
      passwordObj,
    );

    if (!passwordVerify) {
      throw new Error('AUTHENTICATION_FAILED');
    }

    return user;
  }
}
