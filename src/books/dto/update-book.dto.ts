import { IsString, IsNumber, IsBoolean, IsEmail } from 'class-validator';
import { CreateBookDto } from './create-book.dto';

export class UpdateBookDto {
  @IsNumber()
  readonly previousSeat: number;

  @IsNumber()
  readonly seat: number;
}
