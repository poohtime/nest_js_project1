import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateConcertDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString()
  readonly category: string;

  @IsString()
  readonly place: string;

  @IsNumber()
  readonly seats: number;

  @IsDateString()
  readonly time: Date;

  @IsNumber()
  readonly price: number;
}
