import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { TransactionStatus, TransactionType } from '../../../generated/prisma';
import { Transform } from 'class-transformer';

export class GetAllQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  customerName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  gardenName?: string;

  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  size?: number = 5;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, { message: 'Format bulan harus YYYY-MM' }) // Validasi format YYYY-MM
  month?: string = (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  })();
}
