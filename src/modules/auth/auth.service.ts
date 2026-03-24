import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { ErrorCode } from '@common/enums/error-codes.enum';
import { getErrorMessage } from '@common/utils/messages.util';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthRepository, CreateSchoolWithAdminDto } from './auth.repository';
import { LoginDto } from './dto/login.dto';
import { RegisterSchoolDto } from './dto/register-school.dto';
import { UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  schoolId: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    schoolId: string | null;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  /**
   * Connexion utilisateur avec résolution multi-tenant.
   *
   * @param loginDto   - { email, password }
   * @param ipAddress  - Adresse IP de la requête (pour la session)
   * @param schoolId   - ID de l'école résolu depuis le sous-domaine (null = SUPER_ADMIN)
   */
async login(loginDto: LoginDto, ipAddress: string, schoolId: string | null = null): Promise<AuthResponse> {
    console.log('🔍 [LOGIN] Email:', loginDto.email, 'SchoolId:', schoolId, 'IP:', ipAddress);
    
    // Cherche l'utilisateur DANS le tenant (ou globalement pour SUPER_ADMIN)
    const user = await this.authRepository.findUserByEmail(
      loginDto.email,
      schoolId ?? undefined,
    );
    console.log('👤 [LOGIN] User found:', !!user ? user.role : 'null');

    if (!user || !(await bcrypt.compare(loginDto.password, user.passwordHash))) {
      console.log('❌ [LOGIN] Auth failed - invalid credentials');
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_INVALID_CREDENTIALS,
        message: getErrorMessage(ErrorCode.AUTH_INVALID_CREDENTIALS),
      });
    }
    console.log('✅ [LOGIN] Password OK, role:', user.role);

    // Vérifie que le SUPER_ADMIN ne tente pas de se connecter via un sous-domaine
    // et qu'un user d'école ne tente pas de se connecter sans sous-domaine
    if (schoolId === null && user.role !== UserRole.SUPER_ADMIN) {
      // Un user d'école tente de se connecter sans tenant → refus
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_INVALID_CREDENTIALS,
        message: getErrorMessage(ErrorCode.AUTH_INVALID_CREDENTIALS),
      });
    }

    if (!user.isActive) {
      throw new ForbiddenException({
        code: ErrorCode.AUTH_ACCOUNT_INACTIVE,
        message: getErrorMessage(ErrorCode.AUTH_ACCOUNT_INACTIVE),
      });
    }

    // Génération des tokens JWT
    console.log('🔑 [LOGIN] Generating JWT tokens...');
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    console.log('📱 [LOGIN] Creating session...');
    // Création de la session
    await this.authRepository.createSession({
      userId: user.id,
      token: accessToken,
      refreshToken,
      expiresAt,
      ipAddress,
    });
    console.log('✅ [LOGIN] Session created, login SUCCESS');

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        schoolId: user.schoolId,
      },
    };
  }

  /**
   * Inscription d'une nouvelle école avec son administrateur.
   * Correction du bug : vérifie le slug (pas l'email) pour l'unicité.
   */
  async registerSchool(dto: RegisterSchoolDto): Promise<{ school: any; admin: any }> {
    // Vérifie que le slug n'est pas déjà pris
    const existingSchool = await this.authRepository.findSchoolBySlug(dto.slug);
    if (existingSchool) {
      throw new ConflictException({
        code: ErrorCode.SCHOOL_SLUG_EXISTS,
        message: getErrorMessage(ErrorCode.SCHOOL_SLUG_EXISTS),
      });
    }

    const hashedPassword = await bcrypt.hash(dto.adminPassword, 12);

    return this.authRepository.createSchoolWithAdmin({
      ...dto,
      adminPassword: hashedPassword,
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const session = await this.authRepository.findSessionByRefreshToken(refreshToken);

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_INVALID_REFRESH_TOKEN,
        message: getErrorMessage(ErrorCode.AUTH_INVALID_REFRESH_TOKEN),
      });
    }

    const user = await this.authRepository.findUserById(session.userId);
    if (!user) {
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_USER_NOT_FOUND,
        message: getErrorMessage(ErrorCode.AUTH_USER_NOT_FOUND),
      });
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
    };

    const newAccessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Rotation du refresh token
    await this.authRepository.deleteSessionById(session.id);
    await this.authRepository.createSession({
      userId: user.id,
      token: newAccessToken,
      refreshToken: newRefreshToken,
      expiresAt,
      ipAddress: session.ipAddress ?? undefined,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        schoolId: user.schoolId,
      },
    };
  }

  async logout(userId: string): Promise<void> {
    await this.authRepository.deleteUserSessions(userId);
  }
}
