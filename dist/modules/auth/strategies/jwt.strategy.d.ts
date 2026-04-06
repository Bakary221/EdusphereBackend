import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@database/prisma.service';
import { JwtPayload } from '../auth.service';
import { TenantDatabaseService } from '@database/tenant-database.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private prisma;
    private tenantDatabaseService;
    constructor(configService: ConfigService, prisma: PrismaService, tenantDatabaseService: TenantDatabaseService);
    validate(payload: JwtPayload): Promise<{
        id: any;
        sub: any;
        email: any;
        role: any;
        schoolId: string;
    }>;
}
export {};
