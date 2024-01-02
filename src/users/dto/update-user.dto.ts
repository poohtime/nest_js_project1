import { IsString, IsStrongPassword } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsStrongPassword()
  readonly password!: string;
}
