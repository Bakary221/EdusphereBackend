import { Injectable } from '@nestjs/common';
import { PrismaService } from '@database/prisma.service';
import { User, School, Session, UserRole, SchoolStatus } from '@prisma/client';
import { TenantDatabaseService } from '@database/tenant-database.service';
import { TenantProvisioningService } from '@database/tenant-provisioning.service';
import { ITenant } from '@common/interfaces/tenant.interface';
import { SchoolType } from '@common/constants/school-types';

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
  email?: string;
  contactEmail?: string;
  adminEmail: string;
  adminPasswordHash: string;
  adminFirstName: string;
  adminLastName: string;
  adminPhone?: string;
  phone?: string;
  city?: string;
  country?: string;
  address?: string;
  description?: string;
  logo?: string;
  brandingColor?: string;
  brandingSecondaryColor?: string;
  brandingSlogan?: string;
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

  private async resolvePrismaClient(tenant: ITenant | null): Promise<any> {
    if (tenant) {
      return this.tenantDatabaseService.getClientForTenant(tenant);
    }
    return this.prisma;
  }

  private isSchemaMismatchError(error: unknown): boolean {
    if (!error || typeof error !== 'object' || !('code' in error) || typeof (error as { code?: unknown }).code !== 'string') {
      return false;
    }

    return (error as { code?: string }).code === 'P2021' || (error as { code?: string }).code === 'P2022';
  }

  private async withTenantSchemaRepair<T>(
    tenant: ITenant | null,
    operation: () => Promise<T>,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (!tenant || !this.isSchemaMismatchError(error)) {
        throw error;
      }

      await this.tenantProvisioningService.syncTenantSchema(tenant.databaseUrl, tenant.slug);
      return operation();
    }
  }

  async findUserByEmail(email: string, tenant?: ITenant | null): Promise<User | null> {
    const prisma = await this.resolvePrismaClient(tenant);
    return this.withTenantSchemaRepair(tenant ?? null, () =>
      prisma.user.findFirst({
        where: {
          email,
        },
      }),
    );
  }

  async findUserById(id: string, tenant?: ITenant | null): Promise<User | null> {
    const prisma = await this.resolvePrismaClient(tenant);
    return this.withTenantSchemaRepair(tenant ?? null, () => prisma.user.findUnique({ where: { id } }));
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
      const schoolData = {
        name: data.name,
        slug: data.slug,
        email: data.contactEmail ?? data.email ?? data.adminEmail,
        type: data.type ?? 'PRIVATE',
        status: 'ACTIVE',
        plan: data.plan ?? 'free',
        databaseUrl,
        phone: data.adminPhone ?? data.phone ?? null,
        city: data.city ?? null,
        country: data.country ?? null,
        address: data.address ?? null,
        description: data.description ?? null,
        logo: data.logo ?? null,
        brandingColor: data.brandingColor ?? null,
        brandingSecondaryColor: data.brandingSecondaryColor ?? null,
        brandingSlogan: data.brandingSlogan ?? null,
      } as any;

      const school = await tx.school.create({
        data: schoolData,
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
          phone: data.adminPhone ?? data.phone ?? null,
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
    return this.withTenantSchemaRepair(tenant, () =>
      prisma.session.findUnique({ where: { refreshToken: token } }),
    );
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
    return this.withTenantSchemaRepair(tenant, () => prisma.session.create({ data }));
  }

  async deleteSessionById(id: string, tenant: ITenant | null): Promise<Session> {
    const prisma = await this.resolvePrismaClient(tenant);
    return this.withTenantSchemaRepair(tenant, () => prisma.session.delete({ where: { id } }));
  }

  async deleteUserSessions(userId: string, tenant: ITenant | null): Promise<void> {
    const prisma = await this.resolvePrismaClient(tenant);
    await this.withTenantSchemaRepair(tenant, () => prisma.session.deleteMany({ where: { userId } }));
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
