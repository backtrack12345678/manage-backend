import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseInterceptors,
  ParseFilePipeBuilder,
  UploadedFile,
  Req,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {
  UpdateTransactionDto,
  UpdateValidatedTransactionDto,
  ValidateTransactionDto,
} from './dto/update-transaction.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../auth/decorators/auth.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '../../generated/prisma';
import { FilesValidator } from '../file/pipes/files.validator';
import { IAuth } from '../auth/interfaces/auth.interface';
import { GetAllQueryDto } from './dto/get-transaction.dto';
import { Request } from 'express';

const allowedMimeTypes = {
  media: ['image/png', 'image/jpg', 'image/jpeg'],
};

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @Auth()
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('media', {
      limits: {
        fileSize: 20 * 1024 * 1024,
      },
    }),
  )
  async create(
    @Req() request: any,
    @Body() payload: CreateTransactionDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new FilesValidator({
            mimeTypes: allowedMimeTypes,
          }),
        )
        .build(),
    )
    media: Express.Multer.File,
  ) {
    const auth: IAuth = request.user;
    const result = await this.transactionService.create(
      auth,
      payload,
      media,
      request,
    );
    return {
      status: 'success',
      message: 'Transaksi Berhasil Dibuat',
      data: result,
    };
  }

  @Auth()
  @Get()
  async findAll(@Req() request: Request, @Query() query?: GetAllQueryDto) {
    const result = await this.transactionService.findAll(request, query);
    return {
      status: 'success',
      data: result,
    };
  }

  @Auth()
  @Get(':id')
  async findOne(@Req() request: Request, @Param('id') id: string) {
    const result = await this.transactionService.findOne(request, id);
    return {
      status: 'success',
      data: result,
    };
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @Auth()
  @Roles(UserRole.ADMIN, UserRole.SPV)
  @Post(':id/validate')
  async validate(
    @Req() request: any,
    @Param('id') id: string,
    @Body() payload: ValidateTransactionDto,
  ) {
    const auth: IAuth = request.user;
    const result = await this.transactionService.validate(
      auth,
      id,
      payload,
      request,
    );
    return {
      status: 'success',
      message: 'Transaksi Berhasil Divalidasi',
      data: result,
    };
  }

  @Auth()
  @Roles(UserRole.ADMIN, UserRole.SPV)
  @Patch(':id/validate')
  async updateTypeValidatedTransaction(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() payload: UpdateValidatedTransactionDto,
  ) {
    const result = await this.transactionService.updateTypeValidatedTransaction(
      id,
      payload,
      request,
    );
    return {
      status: 'success',
      message: 'Tipe Transaksi Berhasil Diubah',
      data: result,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
