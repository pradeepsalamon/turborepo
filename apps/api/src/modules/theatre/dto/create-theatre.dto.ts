import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTheatreDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  location: string;
}
