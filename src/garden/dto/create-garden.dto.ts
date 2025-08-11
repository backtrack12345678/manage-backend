import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreateGardenDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGardenWoodDto)
  woods?: CreateGardenWoodDto[];
}

class CreateGardenWoodDto {
  @IsInt()
  @IsPositive()
  woodId: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}
