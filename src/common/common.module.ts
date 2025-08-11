import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ErrorService } from './error/error.service';
import { ErrorFilter } from './error/error.filter';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
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
