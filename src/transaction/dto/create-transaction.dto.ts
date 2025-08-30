import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
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

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  date: Date;
}
