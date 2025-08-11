import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim()?.toLowerCase())
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
