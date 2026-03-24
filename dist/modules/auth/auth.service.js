"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const error_codes_enum_1 = require("../../common/enums/error-codes.enum");
const messages_util_1 = require("../../common/utils/messages.util");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const auth_repository_1 = require("./auth.repository");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    constructor(authRepository, jwtService) {
        this.authRepository = authRepository;
        this.jwtService = jwtService;
    }
    async login(loginDto, ipAddress, schoolId = null) {
        console.log('🔍 [LOGIN] Email:', loginDto.email, 'SchoolId:', schoolId, 'IP:', ipAddress);
        const user = await this.authRepository.findUserByEmail(loginDto.email, schoolId ?? undefined);
        console.log('👤 [LOGIN] User found:', !!user ? user.role : 'null');
        if (!user || !(await bcrypt.compare(loginDto.password, user.passwordHash))) {
            console.log('❌ [LOGIN] Auth failed - invalid credentials');
            throw new common_1.UnauthorizedException({
                code: error_codes_enum_1.ErrorCode.AUTH_INVALID_CREDENTIALS,
                message: (0, messages_util_1.getErrorMessage)(error_codes_enum_1.ErrorCode.AUTH_INVALID_CREDENTIALS),
            });
        }
        console.log('✅ [LOGIN] Password OK, role:', user.role);
        if (schoolId === null && user.role !== client_1.UserRole.SUPER_ADMIN) {
            throw new common_1.UnauthorizedException({
                code: error_codes_enum_1.ErrorCode.AUTH_INVALID_CREDENTIALS,
                message: (0, messages_util_1.getErrorMessage)(error_codes_enum_1.ErrorCode.AUTH_INVALID_CREDENTIALS),
            });
        }
        if (!user.isActive) {
            throw new common_1.ForbiddenException({
                code: error_codes_enum_1.ErrorCode.AUTH_ACCOUNT_INACTIVE,
                message: (0, messages_util_1.getErrorMessage)(error_codes_enum_1.ErrorCode.AUTH_ACCOUNT_INACTIVE),
            });
        }
        console.log('🔑 [LOGIN] Generating JWT tokens...');
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            schoolId: user.schoolId,
        };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        console.log('📱 [LOGIN] Creating session...');
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
    async registerSchool(dto) {
        const existingSchool = await this.authRepository.findSchoolBySlug(dto.slug);
        if (existingSchool) {
            throw new common_1.ConflictException({
                code: error_codes_enum_1.ErrorCode.SCHOOL_SLUG_EXISTS,
                message: (0, messages_util_1.getErrorMessage)(error_codes_enum_1.ErrorCode.SCHOOL_SLUG_EXISTS),
            });
        }
        const hashedPassword = await bcrypt.hash(dto.adminPassword, 12);
        return this.authRepository.createSchoolWithAdmin({
            ...dto,
            adminPassword: hashedPassword,
        });
    }
    async refreshToken(refreshToken) {
        const session = await this.authRepository.findSessionByRefreshToken(refreshToken);
        if (!session || session.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException({
                code: error_codes_enum_1.ErrorCode.AUTH_INVALID_REFRESH_TOKEN,
                message: (0, messages_util_1.getErrorMessage)(error_codes_enum_1.ErrorCode.AUTH_INVALID_REFRESH_TOKEN),
            });
        }
        const user = await this.authRepository.findUserById(session.userId);
        if (!user) {
            throw new common_1.UnauthorizedException({
                code: error_codes_enum_1.ErrorCode.AUTH_USER_NOT_FOUND,
                message: (0, messages_util_1.getErrorMessage)(error_codes_enum_1.ErrorCode.AUTH_USER_NOT_FOUND),
            });
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            schoolId: user.schoolId,
        };
        const newAccessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
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
    async logout(userId) {
        await this.authRepository.deleteUserSessions(userId);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_repository_1.AuthRepository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map