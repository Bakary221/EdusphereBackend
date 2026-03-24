import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '@database/prisma.service';
import { ITenant } from '@common/interfaces/tenant.interface';
export declare class TenantMiddleware implements NestMiddleware {
    private readonly prisma;
    constructor(prisma: PrismaService);
    use(req: Request & {
        school?: ITenant | null;
    }, res: Response, next: NextFunction): Promise<void>;
}
