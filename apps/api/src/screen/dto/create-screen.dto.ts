import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateScreenDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  totalSeats: number;

  @IsString()
  @IsNotEmpty()
  theatreId: string;
}
