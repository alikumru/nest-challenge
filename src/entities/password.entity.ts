import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';
import { User } from './user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  VersionColumn,
} from 'typeorm';

/**
 * @name PasswordRegex
 * @description Regex to validate if a password string matches the following complexity rules:
 * - Password length:
 *    - Minimum of 8 characters
 *    - Maximum of 128 characters
 * - Complexity Rules: (Minimum of 3 of the 4 complexity rules need to be applied)
 *    - At least 1 lowercase character (a-z)
 *    - At least 1 uppercase character (A-Z)
 *    - At least 1 digit (0-9)
 *    - At least 1 special character
 * - Other mandatory rules:
 *    - Not more than 2 identical characters in a row (e.g., 111 or AAA is not allowed)
 *    - Password cannot be the same as the username or email (application specific functionality)
 */
export let PasswordRegex =
  /^(?:(?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))(?!.*(.)\1{2,})[A-Za-z0-9!~<>,;:_=?*+#."&§%°()|[\]\-$^@/]{__MINLENGTH__,__MAXLENGTH__}$/;

/**
 * @name DefaultPasswordOptions
 * @description Default min -and max length for a password
 */
export const DefaultPasswordOptions = {
  minLength: 8,
  maxLength: 128,
};

// Update the Regex to use the DefaultPasswordOptions for min -and max length
let PasswordRegexString = PasswordRegex.toString();
PasswordRegexString = PasswordRegexString.replace(
  '__MINLENGTH__',
  DefaultPasswordOptions.minLength.toString(),
);
PasswordRegexString = PasswordRegexString.replace(
  '__MAXLENGTH__',
  DefaultPasswordOptions.maxLength.toString(),
);
PasswordRegex = new RegExp(PasswordRegexString);

/**
 * @name PASSWORD_HASH_ALGORIHTM
 * @description The password hashing mechanisms used to encrypt our passwords
 */
export enum PASSWORD_HASH_ALGORIHTM {
  ARGON2ID = 'argon2id',
  SCRYPT = 'scrypt',
  BCRYPT = 'bcrypt',
}

/**
 * @name DEFAULT_HASH_ALGORITHM
 * @description The default encryption mechanism for active passwords
 */
export const DEFAULT_HASH_ALGORITHM: PASSWORD_HASH_ALGORIHTM =
  PASSWORD_HASH_ALGORIHTM.ARGON2ID;

/**
 * @name PasswordStatus
 * @description Value to determine if a password is active or used as a failover. Inactive passwords are used as failover(s) for the case that the encryption mechanism of the active password is comprimised
 */
export enum PasswordStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity()
export class Password extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  public readonly id!: string;

  @Column()
  @IsUUID()
  public correlation_id!: string;

  @Column()
  @IsString()
  @Matches(PasswordRegex, {
    message: `The password doesn't meet the requirements`,
  })
  public password!: string;

  @Column({
    type: 'enum',
    enum: PASSWORD_HASH_ALGORIHTM,
    default: DEFAULT_HASH_ALGORITHM,
  })
  @IsEnum(PASSWORD_HASH_ALGORIHTM)
  public hash_algorithm: PASSWORD_HASH_ALGORIHTM;

  @Column({
    type: 'enum',
    enum: PasswordStatus,
    default: PasswordStatus.INACTIVE,
  })
  @IsEnum(PasswordStatus)
  public status: PasswordStatus;

  @Column('simple-json')
  @IsOptional()
  public options?: {
    salt?: string;
    saltRounds?: number;
    keyLength?: number;
  };

  @Column({
    default: false,
  })
  @IsBoolean()
  public archived: boolean;

  @CreateDateColumn()
  @IsDate()
  public readonly created_at!: Date;

  @UpdateDateColumn()
  @IsDate()
  public readonly updated_at!: Date;

  @VersionColumn()
  @IsNumber()
  public readonly record_version!: number;

  /**
   * Relations
   */

  // Passwords relation
  @ManyToOne(() => User, (user) => user.passwords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user!: User | null;
}
