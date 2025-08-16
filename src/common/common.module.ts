import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ErrorService } from './error/error.service';
import { ErrorFilter } from './error/error.filter';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { FileModule } from '../file/file.module';

@Global()
@Module({
  imports: [
    FileModule,
    JwtModule.register({
      global: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    MulterModule.register(),
  ],
  providers: [
    PrismaService,
    ErrorService,
    {
      provide: 'APP_FILTER',
      useClass: ErrorFilter,
    },
  ],
  exports: [PrismaService, ErrorService],
})
export class CommonModule {}
