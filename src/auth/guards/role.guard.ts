import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ErrorService } from '../../common/error/error.service';
import { ROLES_KEY } from '../decorators/role.decorator';
import { UserRole } from '../../../generated/prisma';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private errorService: ErrorService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getClass(), context.getHandler()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!requiredRoles.some((role) => user.role?.includes(role))) {
      this.errorService.forbidden('Anda Tidak Memiliki Izin Untuk Akses');
    }

    return true;
  }
}
