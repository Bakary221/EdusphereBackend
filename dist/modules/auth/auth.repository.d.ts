import { PrismaService } from '@database/prisma.service';
import { User, School, Session } from '@prisma/client';
import { UserRole } from '@prisma/client';
export interface CreateUserDto {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    schoolId?: string;
}
export interface CreateSchoolWithAdminDto {
    name: string;
    slug: string;
    email: string;
    adminEmail: string;
    adminPassword: string;
    adminFirstName: string;
    adminLastName: string;
}
export declare class AuthRepository {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findUserByEmail(email: string, schoolId?: string): Promise<User | null>;
    findUserById(id: string): Promise<User | null>;
    findSchoolBySlug(slug: string): Promise<School | null>;
    createUser(data: CreateUserDto): Promise<User>;
    updateUser(id: string, data: Partial<User>): Promise<User>;
    createSchoolWithAdmin(data: CreateSchoolWithAdminDto): Promise<{
        school: School;
        admin: User;
    }>;
    findSessionByRefreshToken(token: string): Promise<Session | null>;
    createSession(data: {
        userId: string;
        token: string;
        refreshToken: string;
        expiresAt: Date;
        userAgent?: string;
        ipAddress?: string;
    }): Promise<Session>;
    deleteSessionById(id: string): Promise<Session>;
    deleteUserSessions(userId: string): Promise<void>;
}
