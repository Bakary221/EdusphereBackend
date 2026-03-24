import {
  Injectable,
  NestMiddleware,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '@database/prisma.service';
import { ErrorCode } from '@common/enums/error-codes.enum';
import { getErrorMessage } from '@common/utils/messages.util';
import { ITenant } from '@common/interfaces/tenant.interface';

/**
 * TenantMiddleware — résout le tenant depuis le header X-Tenant-Slug
 *
 * Cas possibles :
 *  - Aucun header → req.school = null  (contexte SUPER_ADMIN ou route publique)
 *  - Slug inconnu  → 404 TENANT_NOT_FOUND
 *  - École SUSPENDED/PENDING → 403 TENANT_SUSPENDED
 *  - École ACTIVE   → req.school = { id, slug, name, status, plan }
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request & { school?: ITenant | null }, res: Response, next: NextFunction) {
    const slug = req.headers['x-tenant-slug'] as string | undefined;

    // Pas de header → contexte sans tenant (SUPER_ADMIN)
    if (!slug || slug.trim() === '') {
      req.school = null;
      return next();
    }

    // Cherche l'école par son slug
    const school = await this.prisma.school.findUnique({
      where: { slug: slug.trim().toLowerCase() },
      select: { id: true, slug: true, name: true, status: true, plan: true },
    });

    if (!school) {
      throw new NotFoundException({
        code: ErrorCode.TENANT_NOT_FOUND,
        message: getErrorMessage(ErrorCode.TENANT_NOT_FOUND),
      });
    }

    if (school.status !== 'ACTIVE') {
      throw new ForbiddenException({
        code: ErrorCode.TENANT_SUSPENDED,
        message: getErrorMessage(ErrorCode.TENANT_SUSPENDED),
      });
    }

    // Attache le tenant à la requête HTTP
    req.school = school as ITenant;
    next();
  }
}
