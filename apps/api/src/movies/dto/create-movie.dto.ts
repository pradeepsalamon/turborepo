import { IsString, IsNumber } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsNumber()
  duration: number;
  @IsString()
  language: string;
}
