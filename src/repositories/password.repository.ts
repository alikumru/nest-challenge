import * as argon2 from 'argon2';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { EntityRepository, Repository } from 'typeorm';
import { ChangePasswordDto } from 'src/dtos/password.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/entities/user.entity';

import {
  DEFAULT_HASH_ALGORITHM,
  Password,
  PasswordStatus,
  PASSWORD_HASH_ALGORIHTM,
} from '../entities/password.entity';

const ARGON2_ID_OPTIONS = {
  memoryCost: 2 ** 16,
  timeCost: 3,
  hashLength: 32,
  parallelism: 1,
};

const BCRYPT_OPTIONS = {
  saltRounds: 10,
};

const SCRYPT_OPTIONS = {
  keyLength: 64,
};

@EntityRepository(Password)
export class PasswordRepository extends Repository<Password> {
  /**
   * @name generateSalt
   * @description Generate a random salt
   * @param length
   * @returns Promise<string>
   */
  private async generateSalt(length = 32): Promise<string> {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  /**
   * @name hashScrypt
   * @description Hash a string with Scrypt
   * @param password
   * @param salt
   * @param keyLength
   * @returns Promise<string>
   */
  private async hashScrypt(
    password: string,
    salt: string,
    keyLength: number = SCRYPT_OPTIONS.keyLength,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.scrypt(password, salt, keyLength, (err, derivedKey) => {
        if (err) {
          reject(err);
        }
        resolve(derivedKey.toString('hex'));
      });
    });
  }

  /**
   * @name createPasswordObject
   * @description Create a Password object that can be stored in the database
   * @param password
   * @param hashAlgoritm
   * @returns Promise<Password>
   */
  public async createPasswordObject(
    password: string,
    hashAlgoritm: PASSWORD_HASH_ALGORIHTM,
  ): Promise<Password> {
    let hashedPassword: Password;
    switch (hashAlgoritm) {
      case PASSWORD_HASH_ALGORIHTM.ARGON2ID:
        hashedPassword = this.manager.create(Password, {
          password: await argon2.hash(password, {
            ...ARGON2_ID_OPTIONS,
            type: argon2.argon2id,
          }),
          hash_algorithm: PASSWORD_HASH_ALGORIHTM.ARGON2ID,
          options: {},
          status:
            PASSWORD_HASH_ALGORIHTM.ARGON2ID === DEFAULT_HASH_ALGORITHM
              ? PasswordStatus.ACTIVE
              : PasswordStatus.INACTIVE,
          archived: false,
        });

        break;
      case PASSWORD_HASH_ALGORIHTM.BCRYPT: {
        hashedPassword = this.manager.create(Password, {
          password: await bcrypt.hash(password, BCRYPT_OPTIONS.saltRounds),
          hash_algorithm: PASSWORD_HASH_ALGORIHTM.BCRYPT,
          options: {
            saltRounds: BCRYPT_OPTIONS.saltRounds,
          },
          status:
            PASSWORD_HASH_ALGORIHTM.BCRYPT === DEFAULT_HASH_ALGORITHM
              ? PasswordStatus.ACTIVE
              : PasswordStatus.INACTIVE,
          archived: false,
        });
        break;
      }
      case PASSWORD_HASH_ALGORIHTM.SCRYPT: {
        const salt = await this.generateSalt();
        hashedPassword = this.manager.create(Password, {
          password: await this.hashScrypt(password, salt),
          hash_algorithm: PASSWORD_HASH_ALGORIHTM.SCRYPT,
          options: {
            salt,
            keyLength: SCRYPT_OPTIONS.keyLength,
          },
          status:
            PASSWORD_HASH_ALGORIHTM.SCRYPT === DEFAULT_HASH_ALGORITHM
              ? PasswordStatus.ACTIVE
              : PasswordStatus.INACTIVE,
          archived: false,
        });
        break;
      }
    }
    return hashedPassword;
  }

  /**
   * @name verifyPassword
   * @description Compare a given password (plain text) to a (active) Password object
   * @param givenPassword
   * @param hashAlgoritm
   * @param passwordObject
   * @returns boolean
   */
  public async verifyPassword(
    givenPassword: string,
    passwordObject: Password,
  ): Promise<boolean> {
    let verify = false;
    switch (passwordObject.hash_algorithm) {
      case PASSWORD_HASH_ALGORIHTM.ARGON2ID: {
        verify = await argon2.verify(passwordObject.password, givenPassword);
        break;
      }
      case PASSWORD_HASH_ALGORIHTM.BCRYPT: {
        verify = await bcrypt.compare(givenPassword, passwordObject.password);
        break;
      }
      case PASSWORD_HASH_ALGORIHTM.SCRYPT: {
        const { salt, keyLength } = passwordObject.options;
        const hashGivenPassword = await this.hashScrypt(
          givenPassword,
          salt,
          keyLength,
        );
        verify = passwordObject.password === hashGivenPassword;
        break;
      }
    }
    return verify;
  }

  async checkLastThreePasswords(newPassword: string, user: User): Promise<boolean> {

    let isSame: boolean | PromiseLike<boolean> = false;
    const lastThreePasswords = await this.manager.find(Password,
      {
        where: { user: user, hash_algorithm: DEFAULT_HASH_ALGORITHM },
        order: { created_at: 'DESC' },
        take: 3
      }
    );

    for (const pass in lastThreePasswords) {
      if (isSame == false) 
       isSame = await this.verifyPassword(newPassword, lastThreePasswords[pass]);
      else 
        return isSame;
    }
    return isSame;
  }

  async getUserPasswords(
    user: User
  ): Promise<Object> {

    const allPasswords = await this.manager.find(Password,
      {
        where: { user: user },
        order: { created_at: 'DESC' },
      }
    );
    return allPasswords
  }

  public async changePassword(
    changePasswordDto: ChangePasswordDto,
    user: User
  ): Promise<boolean> {
    const correlationId = uuidv4();

    const currentPassword = await this.updateCurrentPassword(user);
    // Check if updating process of the old passwords is success
    if (currentPassword) false;

    const addingNewPasswords = await this.insertUserPasswords(changePasswordDto, currentPassword, user, correlationId); 
    // Check if adding process of the new passwords is success
    if (!addingNewPasswords) return false

    return true;
  }

  async updateCurrentPassword(
    user: User
  ): Promise<Password[]> {

    // Get old and unarchived passwords
    const oldPasswords = await this.manager.find(Password,
      {
        where: { user: user, archived: false }
      }
    );

    try {
      //Update status and archive columns of all old passwords  
      oldPasswords.forEach((passwords) => {
        passwords.status = PasswordStatus.INACTIVE;
        passwords.archived = true
      });
      
    } catch (error) {
      return null
    }
    return oldPasswords
  }

  async insertUserPasswords(
    changePasswordDto: ChangePasswordDto,
    currentPasswords: Password[],
    user: User,
    correlationId: string
  ): Promise<boolean> {

    const newPasswords: Password[] = [];
    for (const key in PASSWORD_HASH_ALGORIHTM) {
      const passwordObj = await this.createPasswordObject(
        changePasswordDto.newPassword,
        PASSWORD_HASH_ALGORIHTM[key],
      );
      // Add the password to the passwords array with user
      newPasswords.push(
        this.create({
          ...passwordObj,
          correlation_id: correlationId,
          user: user
        }),
      );
    }

    try {
      await this.saveNewPassword(currentPasswords, newPasswords);
    } catch (error) {
      return false;
    }
    return true;
  }

  async saveNewPassword(
    currentPasswords: Password[],
    userNewPasswords: Password[]
  ): Promise<boolean> {

    try {
      await this.manager.transaction(async entityManager => {
        await entityManager.save(currentPasswords);
        await entityManager.save(userNewPasswords);
      });
    } catch (error) {
      return false;
    }
    return true;
  }
}
