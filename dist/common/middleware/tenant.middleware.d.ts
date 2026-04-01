import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@database/prisma.service';
import { ITenant } from '@common/interfaces/tenant.interface';
export declare class TenantMiddleware implements NestMiddleware {
    private readonly prisma;
    private readonly config;
    constructor(prisma: PrismaService, config: ConfigService);
    use(req: Request & {
        school?: ITenant | null;
    }, res: Response, next: NextFunction): Promise<void>;
    private handleTenant;
    private extractSlugFromHostname;
}
