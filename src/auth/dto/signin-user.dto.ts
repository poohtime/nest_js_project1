import { IsString } from 'class-validator';

export class SignInUserDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;
}
