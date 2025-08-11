import { PartialType } from '@nestjs/mapped-types';
import { CreateWoodDto } from './create-wood.dto';
import { Equals, IsBoolean, IsOptional } from 'class-validator';

export class UpdateWoodDto extends PartialType(CreateWoodDto) {
  @IsOptional()
  @IsBoolean()
  @Equals(true, { message: 'isActive harus true' })
  isActive: boolean;
}
