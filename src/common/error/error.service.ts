import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ErrorService {
  badRequest(message: string): void {
    throw new BadRequestException(message);
  }

  notFound(message: string): void {
    throw new NotFoundException(message);
  }

  unauthorized(message: string): void {
    throw new UnauthorizedException(message);
  }

  forbidden(message: string): void {
    throw new ForbiddenException(message);
  }

  internalServerError(message: string): void {
    throw new InternalServerErrorException(message);
  }
}
