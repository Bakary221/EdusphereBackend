import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
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
export declare class AuthService {
    private authRepository;
    private jwtService;
    constructor(authRepository: AuthRepository, jwtService: JwtService);
    login(loginDto: LoginDto, ipAddress: string, schoolId?: string | null): Promise<AuthResponse>;
    registerSchool(dto: RegisterSchoolDto): Promise<{
        school: any;
        admin: any;
    }>;
    refreshToken(refreshToken: string): Promise<AuthResponse>;
    logout(userId: string): Promise<void>;
}
