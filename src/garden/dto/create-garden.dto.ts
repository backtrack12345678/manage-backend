import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateGardenDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsInt()
  @IsPositive()
  woodPiecesQty: number;

  @IsNotEmpty()
  @Matches(/^(0|[1-9]\d{0,15})(\.\d{1,2})?$/, {
    message:
      'woodPiecesCostPrice harus berupa string angka minimal 0 dan maksimal 9999999999999999.99 (DECIMAL(18,2)). Contoh: "0", "1000", atau "9999999999999999.99"',
  })
  woodPiecesCostPrice: string;
}
