import { PrismaService } from '@database/prisma.service';
export declare class RootController {
    private prisma;
    constructor(prisma: PrismaService);
    root(): Promise<{
        message: string;
        version: string;
        status: string;
        database: string;
        endpoints: {
            health: string;
            auth: string;
            docs: string;
        };
    }>;
    status(): Promise<{
        timestamp: string;
        uptime: number;
        env: string;
    }>;
}
