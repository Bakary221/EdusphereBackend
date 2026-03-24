import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class AuthRepository {
  private readonly logger = new Logger(AuthRepository.name);

  constructor(private prisma: PrismaService) {}

  async findUserByEmail(email: string, schoolId?: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { 
        email,
        ...(schoolId && { schoolId }),
      },
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /** Cherche une école par son slug unique. Utilisé par registerSchool() et le TenantMiddleware. */
  async findSchoolBySlug(slug: string): Promise<School | null> {
    return this.prisma.school.findUnique({ where: { slug } });
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
    return this.prisma.$transaction(async (tx) => {
      const school = await tx.school.create({
        data: {
          name: data.name,
          slug: data.slug,
          email: data.email,
          type: 'PRIVATE',
          status: 'ACTIVE',
        },
      });

      const admin = await tx.user.create({
        data: {
          email: data.adminEmail,
          passwordHash: data.adminPassword,
          firstName: data.adminFirstName,
          lastName: data.adminLastName,
          role: 'SCHOOL_ADMIN',
          schoolId: school.id,
        },
      });

      return { school, admin };
    });
  }

  async findSessionByRefreshToken(token: string): Promise<Session | null> {
    return this.prisma.session.findUnique({ where: { refreshToken: token } });
  }

  async createSession(data: {
    userId: string;
    token: string;
    refreshToken: string;
    expiresAt: Date;
    userAgent?: string;
    ipAddress?: string;
  }): Promise<Session> {
    return this.prisma.session.create({ data });
  }

  async deleteSessionById(id: string): Promise<Session> {
    return this.prisma.session.delete({ where: { id } });
  }

  async deleteUserSessions(userId: string): Promise<void> {
    await this.prisma.session.deleteMany({ where: { userId } });
  }
}
