import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;
}
