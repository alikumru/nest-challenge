import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsBoolean, IsDate, IsUUID, IsString, Matches } from 'class-validator';
import { Password } from './password.entity';

// Regular expression to validate if an Emailaddress meets the international standards
export const EmailRegex =
  /^(?=.{1,64}@.*$)(?=.{1,254}$)(?:(?:[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~]+(?:\.[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~]+)*))@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  readonly id?: string;

  @Column()
  @IsString()
  @Matches(EmailRegex)
  @Index('IDX_EMAIL_ADDRESS', { unique: true })
  public email!: string;

  @Column()
  @IsString()
  public name!: string;

  @Column({ default: true })
  @IsBoolean()
  public active?: boolean;

  @CreateDateColumn()
  @IsDate()
  public readonly created_at?: Date;

  @UpdateDateColumn()
  @IsDate()
  public readonly updated_at?: Date;

  @DeleteDateColumn()
  @IsDate()
  public readonly deleted_at?: Date;

  /**
   * Relations
   * @description Relations of the user table
   */

  // Passwords Relation
  @OneToMany(() => Password, (passwords) => passwords.user, {
    cascade: true,
  })
  public passwords?: Password[];
}
