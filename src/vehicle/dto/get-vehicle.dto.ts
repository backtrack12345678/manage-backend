import { IsOptional, IsString, Matches } from 'class-validator';

export class GetReportQueryDto {
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, { message: 'Format bulan harus YYYY-MM' })
  month?: string = (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  })();
}
