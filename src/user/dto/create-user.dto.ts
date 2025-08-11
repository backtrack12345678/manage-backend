import {
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../generated/prisma';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^\S*$/, { message: 'username tidak boleh mengandung spasi' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'username hanya boleh mengandung huruf, angka, dan underscore',
  })
  @Transform(({ value }) => value?.trim()?.toLowerCase())
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(12)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsIn(['SPV', 'MANDOR'], {
    message: 'Role hanya boleh SPV atau MANDOR',
  })
  role: UserRole;
}
