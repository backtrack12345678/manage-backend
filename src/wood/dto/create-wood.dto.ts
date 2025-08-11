/* eslint-disable @typescript-eslint/no-loss-of-precision */
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { WoodUnit } from '../../../generated/prisma';

export class CreateWoodDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @Matches(/^(0|[1-9]\d{0,15})(\.\d{1,2})?$/, {
    message:
      'Price harus berupa string angka minimal 0 dan maksimal 9999999999999999.99 (DECIMAL(18,2)). Contoh: "0", "1000", atau "9999999999999999.99"',
  })
  price: number;

  @IsNotEmpty()
  @IsEnum(WoodUnit)
  unit: WoodUnit;
}
