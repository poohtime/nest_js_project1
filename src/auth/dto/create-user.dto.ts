import {
  IsString,
  IsNumber,
  IsBoolean,
  IsEmail,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  readonly email!: string;

  @IsString()
  @IsStrongPassword()
  readonly password!: string;

  @IsString()
  readonly confirmPassword!: string;

  @IsNumber()
  readonly point!: number;

  @IsBoolean()
  readonly isAdmin: boolean;
}
