import {
  Injectable,
  NestMiddleware,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
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
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async use(req: Request & { school?: ITenant | null }, res: Response, next: NextFunction) {
    const slug = req.headers['x-tenant-slug'] as string | undefined;

    // Pas de header → contexte sans tenant (SUPER_ADMIN)
    if (!slug || slug.trim() === '') {
      req.school = null;
      const hostnameSlug = this.extractSlugFromHostname(req.hostname);
      if (!hostnameSlug) {
        return next();
      }
      return this.handleTenant(hostnameSlug, req, next);
    }

    const normalizedSlug = slug.trim().toLowerCase();
    return this.handleTenant(normalizedSlug, req, next);
  }

  private async handleTenant(
    normalizedSlug: string,
    req: Request & { school?: ITenant | null },
    next: NextFunction,
  ) {
    const slug = normalizedSlug;
    const school = await this.prisma.school.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        status: true,
        plan: true,
        databaseUrl: true,
      },
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

  private extractSlugFromHostname(hostname?: string): string | null {
    if (!hostname) return null;
    const baseDomain = this.config.get<string>('TENANT_BASE_DOMAIN')?.trim().toLowerCase();
    const normalizedHostname = hostname.split(':')[0].toLowerCase();
    if (!baseDomain || !baseDomain.length) {
      return null;
    }
    if (normalizedHostname === baseDomain) {
      return null;
    }
    if (!normalizedHostname.endsWith(baseDomain)) {
      return null;
    }
    const slugPart = normalizedHostname.slice(0, normalizedHostname.length - baseDomain.length);
    const cleaned = slugPart.replace(/\.$/, '').replace(/^\./, '');
    return cleaned.length > 0 ? cleaned : null;
  }
}
