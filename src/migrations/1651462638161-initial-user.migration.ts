import { User } from '../entities/user.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { UserRepository } from '../repositories/user.repository';

export class initialUser1651462638161 implements MigrationInterface {
  name = 'initialUser1651462638161';

  // Initial users
  users = [
    {
      name: 'Test User 1',
      email: 'user1@foreside.nl',
      active: true,
      password: 'Password123!',
    },
    {
      name: 'Test User 2',
      email: 'user2@foreside.nl',
      active: true,
      password: 'Password123!',
    },
    {
      name: 'Test User 3',
      email: 'user3@foreside.nl',
      active: false,
      password: 'Password123!',
    },
  ];

  /**
   * @name up
   * @description Forward running migration
   * @param queryRunner
   * @returns void
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log(`Running migration ${this.name} - UP`);

    const userRepository =
      queryRunner.manager.getCustomRepository(UserRepository);

    // Use `for-loop` instead of iterable methods due to encryption libs not able to deal with the asynchronization of the C++ libs
    for (let i = 0; i < this.users.length; i++) {
      try {
        await userRepository.createNewUser(
          this.users[i],
          this.users[i].password,
        );
      } catch (error) {
        throw new Error(`${this.name} error: ${error}`);
      }
    }
    console.log(`Test users created`);
    return;
  }

  /**
   * @name down
   * @description Rollback running down migration
   * @param queryRunner
   * @returns void
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log(`Running migration ${this.name} DOWN`);
    // Get the unique Emails from the user array
    const uniqueEmailAddresses = [
      ...new Set(this.users.reduce((a, b) => [...a, b.email], [])),
    ];
    try {
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('email IN (:...uniqueEmailAddresses)', {
          uniqueEmailAddresses,
        })
        .execute();
      console.log(`Successfully ran migration ${this.name} - DOWN`);
      return;
    } catch (error) {
      console.error(`Error running migration ${this.name} - DOWN: ${error}`);
      throw new Error(error);
    }
  }
}
