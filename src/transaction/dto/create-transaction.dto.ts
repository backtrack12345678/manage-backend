import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  gardenId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  customerId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  vehicleId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  vehicleNumber: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  woodId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  woodPiecesQty: number;
}
