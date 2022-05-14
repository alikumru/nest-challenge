import { MigrationInterface, QueryRunner } from 'typeorm';

export class initialDatabaseSchemaMigration1641462638160
  implements MigrationInterface
{
  name = 'initialDatabaseSchemaMigration1641462638160';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Running initialDatabaseSchemaMigration1641462638160 UP');

    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "name" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_EMAIL" ON "user" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "password" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "correlation_id" character varying NOT NULL, "password" character varying NOT NULL, "hash_algorithm" "public"."password_hash_algorithm_enum" NOT NULL DEFAULT 'argon2id', "status" "public"."password_status_enum" NOT NULL DEFAULT 'inactive', "options" text NOT NULL, "archived" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "record_version" integer NOT NULL, "user_id" uuid, CONSTRAINT "PK_cbeb55948781be9257f44febfa0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "password" ADD CONSTRAINT "FK_4cd77c9b2e2522ee9d3671b3bc1" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    // await queryRunner.query(
    //   `CREATE TYPE "public"."password_hash_algorithm_enum" AS ENUM('argon2id', 'scrypt', 'bcrypt')`,
    // );
    // await queryRunner.query(
    //   `CREATE TYPE "public"."password_status_enum" AS ENUM('active', 'inactive')`,
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('Running initialDatabaseSchemaMigration1641462638160 DOWN');
    await queryRunner.query(
      `ALTER TABLE "password" DROP CONSTRAINT "FK_4cd77c9b2e2522ee9d3671b3bc1"`,
    );
    // await queryRunner.query(`DROP TYPE "public"."password_status_enum"`);
    // await queryRunner.query(
    //   `DROP TYPE "public"."password_hash_algorithm_enum"`,
    // );
    await queryRunner.query(`DROP TABLE "password"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_EMAIL"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
