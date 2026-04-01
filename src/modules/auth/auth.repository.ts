import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { PrismaClient, User, School, Session, UserRole, SchoolStatus, SchoolType } from '@prisma/client';
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

@Injectable()
export class AuthRepository {
  constructor(
    private prisma: PrismaService,
    private tenantDatabaseService: TenantDatabaseService,
    private tenantProvisioningService: TenantProvisioningService,
  ) {}

  private async resolvePrismaClient(tenant: ITenant | null): Promise<PrismaClient> {
    if (tenant) {
      return this.tenantDatabaseService.getClientForTenant(tenant);
    }
    return this.prisma;
  }

  async findUserByEmail(email: string, tenant?: ITenant | null): Promise<User | null> {
    const prisma = await this.resolvePrismaClient(tenant);
    return prisma.user.findFirst({
      where: { 
        email,
      },
    });
  }

  async findUserById(id: string, tenant?: ITenant | null): Promise<User | null> {
    const prisma = await this.resolvePrismaClient(tenant);
    return prisma.user.findUnique({ where: { id } });
  }

  /** Cherche une école par son slug unique. Utilisé par registerSchool() et le TenantMiddleware. */
  async findSchoolBySlug(slug: string): Promise<School | null> {
    return this.prisma.school.findUnique({ where: { slug } });
  }

  async findSchoolById(id: string): Promise<School | null> {
    return this.prisma.school.findUnique({ where: { id } });
  }

  async createUser(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async createSchoolWithAdmin(data: CreateSchoolWithAdminDto): Promise<{
    school: School;
    admin: User;
  }> {
    const databaseUrl = await this.tenantProvisioningService.ensureTenantDatabase(data.slug);

    return this.prisma.$transaction(async (tx) => {
      const school = await tx.school.create({
        data: {
          name: data.name,
          slug: data.slug,
          email: data.email,
          type: data.type ?? 'PRIVATE',
          status: 'ACTIVE',
          plan: data.plan ?? 'free',
          databaseUrl,
        },
      });

      const tenant: ITenant = {
        id: school.id,
        slug: school.slug,
        name: school.name,
        status: school.status,
        plan: school.plan,
        databaseUrl,
      };

      const tenantClient = await this.tenantDatabaseService.getClientForTenant(tenant);
      const admin = await tenantClient.user.create({
        data: {
          email: data.adminEmail,
          passwordHash: data.adminPasswordHash,
          firstName: data.adminFirstName,
          lastName: data.adminLastName,
          role: 'SCHOOL_ADMIN',
          isActive: true,
          emailVerified: true,
        },
      });

      return { school, admin };
    });
  }

  async findSessionByRefreshToken(token: string, tenant: ITenant | null): Promise<Session | null> {
    const prisma = await this.resolvePrismaClient(tenant);
    return prisma.session.findUnique({ where: { refreshToken: token } });
  }

  async createSession(
    data: {
      userId: string;
      token: string;
      refreshToken: string;
      expiresAt: Date;
      userAgent?: string;
      ipAddress?: string;
    },
    tenant: ITenant | null,
  ): Promise<Session> {
    const prisma = await this.resolvePrismaClient(tenant);
    return prisma.session.create({ data });
  }

  async deleteSessionById(id: string, tenant: ITenant | null): Promise<Session> {
    const prisma = await this.resolvePrismaClient(tenant);
    return prisma.session.delete({ where: { id } });
  }

  async deleteUserSessions(userId: string, tenant: ITenant | null): Promise<void> {
    const prisma = await this.resolvePrismaClient(tenant);
    await prisma.session.deleteMany({ where: { userId } });
  }

  async listSchools(): Promise<School[]> {
    return this.prisma.school.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async updateSchoolStatus(id: string, status: SchoolStatus): Promise<School> {
    return this.prisma.school.update({
      where: { id },
      data: { status },
    });
  }
}
