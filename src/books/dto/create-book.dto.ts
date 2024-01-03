import { IsNumber } from 'class-validator';

export class CreateBookDto {
  @IsNumber()
  readonly seat!: number[];
}
