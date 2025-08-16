import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsNotEmpty, IsNumber, IsPositive, Matches } from 'class-validator';
import { TransactionType } from '../../../generated/prisma';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}

export class ValidateTransactionDto {
  @IsNotEmpty()
  @Matches(/^(0|[1-9]\d{0,15})(\.\d{1,2})?$/, {
    message:
      'Total Price harus berupa string angka minimal 0 dan maksimal 9999999999999999.99 (DECIMAL(18,2)). Contoh: "0", "1000", atau "9999999999999999.99"',
  })
  totalPrice: string;

  @IsNotEmpty()
  @Matches(/^(0|[1-9]\d{0,15})(\.\d{1,2})?$/, {
    message:
      'Paid Amount harus berupa string angka minimal 0 dan maksimal 9999999999999999.99 (DECIMAL(18,2)). Contoh: "0", "1000", atau "9999999999999999.99"',
  })
  totalPaid: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  woodUnitsqty: number;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;
}

export class UpdateValidatedTransactionDto {
  @IsNotEmpty()
  @Matches(/^(0|[1-9]\d{0,15})(\.\d{1,2})?$/, {
    message:
      'Paid Amount harus berupa string angka minimal 0 dan maksimal 9999999999999999.99 (DECIMAL(18,2)). Contoh: "0", "1000", atau "9999999999999999.99"',
  })
  totalPaid: string;

  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;
}
