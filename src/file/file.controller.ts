import { Controller, Get, Param, Res } from '@nestjs/common';
import { FileService } from './file.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { Response } from 'express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Auth()
  @Get('/:folder/:filename')
  async getUserPhoto(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    const { fileStream, mime } = await this.fileService.readFileStream(
      filename,
      folder,
    );
    response.setHeader('Content-Type', mime);
    fileStream.pipe(response);
  }
}
