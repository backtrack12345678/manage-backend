import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ErrorService } from '../common/error/error.service';
import { v4 as uuid } from 'uuid';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { fromFile } from 'file-type';

@Injectable()
export class FileService {
  constructor(
    private errorService: ErrorService,
    private configService: ConfigService,
  ) {}

  async writeFileStream(file: Express.Multer.File, folder: string) {
    const uploadPath = path.join(process.cwd(), 'uploads', folder);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const originalName = file.originalname.split('.')[0]; // Nama asli file tanpa ekstensi
    const uniqueFilename = `${originalName}-${uuid()}`;
    const filePath = path.join('uploads', folder, uniqueFilename);

    console.log(filePath);

    const bufferStream = Readable.from(file.buffer);
    const writeStream = fs.createWriteStream(filePath);

    bufferStream.pipe(writeStream);

    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', () => resolve());
      writeStream.on('error', (err) => reject(err));
    }).catch((err) => {
      console.error('Gagal menulis file:', err);
      throw new Error('File upload gagal'); // penting supaya transaksi rollback
    });

    return { fileName: uniqueFilename, filePath };
  }

  async readFileStream(filename: string, folder: string) {
    const filePath = path.join(process.cwd(), `uploads/${folder}/${filename}`);

    if (!fs.existsSync(filePath)) {
      this.errorService.notFound('File Tidak Ditemukan');
    }

    const { mime } = await fromFile(filePath);
    const fileStream = fs.createReadStream(filePath);
    return { fileStream, mime };
  }

  getHostFile(request: Request): string {
    const protocol: string =
      process.env.NODE_ENV === 'production' ? 'https' : request.protocol;
    return protocol + '://' + request.get('host');
  }
}
