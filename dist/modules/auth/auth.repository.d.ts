import { PrismaService } from '@database/prisma.service';
import { User, School, Session, UserRole, SchoolStatus, SchoolType } from '@prisma/client';
import { TenantDatabaseService } from '@database/tenant-database.service';
import { TenantProvisioningService } from '@database/tenant-provisioning.service';
import { ITenant } from '@common/interfaces/tenant.interface';
export interface CreateUserDto {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}
export interface CreateSchoolWithAdminDto {
    name: string;
    slug: string;
    email: string;
    adminEmail: string;
    adminPasswordHash: string;
    adminFirstName: string;
    adminLastName: string;
    type?: SchoolType;
    plan?: string;
}
export declare class AuthRepository {
    private prisma;
    private tenantDatabaseService;
    private tenantProvisioningService;
    constructor(prisma: PrismaService, tenantDatabaseService: TenantDatabaseService, tenantProvisioningService: TenantProvisioningService);
    private resolvePrismaClient;
    findUserByEmail(email: string, tenant?: ITenant | null): Promise<User | null>;
    findUserById(id: string, tenant?: ITenant | null): Promise<User | null>;
    findSchoolBySlug(slug: string): Promise<School | null>;
    findSchoolById(id: string): Promise<School | null>;
    createUser(data: CreateUserDto): Promise<User>;
    updateUser(id: string, data: Partial<User>): Promise<User>;
    createSchoolWithAdmin(data: CreateSchoolWithAdminDto): Promise<{
        school: School;
        admin: User;
    }>;
    findSessionByRefreshToken(token: string, tenant: ITenant | null): Promise<Session | null>;
    createSession(data: {
        userId: string;
        token: string;
        refreshToken: string;
        expiresAt: Date;
        userAgent?: string;
        ipAddress?: string;
    }, tenant: ITenant | null): Promise<Session>;
    deleteSessionById(id: string, tenant: ITenant | null): Promise<Session>;
    deleteUserSessions(userId: string, tenant: ITenant | null): Promise<void>;
    listSchools(): Promise<School[]>;
    updateSchoolStatus(id: string, status: SchoolStatus): Promise<School>;
}
