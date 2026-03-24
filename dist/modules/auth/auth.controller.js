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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const register_school_dto_1 = require("./dto/register-school.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const current_tenant_decorator_1 = require("../../common/decorators/current-tenant.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const messages_util_1 = require("../../common/utils/messages.util");
const success_messages_enum_1 = require("../../common/enums/success-messages.enum");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto, tenant, req) {
        const ipAddress = Array.isArray(req.ip) ? req.ip[0] : req.ip || 'unknown';
        const result = await this.authService.login(loginDto, ipAddress, tenant?.id ?? null);
        return {
            data: result,
            message: (0, messages_util_1.getSuccessMessage)(success_messages_enum_1.SuccessMessage.LOGIN_SUCCESS),
            ...(tenant && { tenant: { slug: tenant.slug, name: tenant.name } }),
            _links: {
                self: req.originalUrl,
                refresh: '/auth/refresh',
                profile: '/auth/me',
                logout: '/auth/logout',
            },
        };
    }
    async register(dto, req) {
        const result = await this.authService.registerSchool(dto);
        return {
            data: result,
            message: (0, messages_util_1.getSuccessMessage)(success_messages_enum_1.SuccessMessage.REGISTER_SUCCESS),
            _links: {
                self: req.originalUrl,
                login: '/auth/login',
            },
        };
    }
    async refresh(refreshToken, req) {
        const result = await this.authService.refreshToken(refreshToken);
        return {
            data: result,
            message: (0, messages_util_1.getSuccessMessage)(success_messages_enum_1.SuccessMessage.REFRESH_SUCCESS),
            _links: {
                self: req.originalUrl,
                profile: '/auth/me',
                logout: '/auth/logout',
            },
        };
    }
    async logout(userId, req) {
        await this.authService.logout(userId);
        return {
            data: null,
            message: (0, messages_util_1.getSuccessMessage)(success_messages_enum_1.SuccessMessage.LOGOUT_SUCCESS),
            _links: {
                self: req.originalUrl,
                login: '/auth/login',
            },
        };
    }
    async getProfile(user, req) {
        return {
            data: user,
            message: (0, messages_util_1.getSuccessMessage)(success_messages_enum_1.SuccessMessage.PROFILE_FETCHED),
            _links: {
                self: req.originalUrl,
                logout: '/auth/logout',
            },
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Connexion utilisateur' }),
    (0, swagger_1.ApiHeader)({
        name: 'X-Tenant-Slug',
        required: false,
        example: 'lycee-excellence'
    }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Connexion réussie' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Identifiants invalides' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Ecole suspendue' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ecole introuvable' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_tenant_decorator_1.CurrentTenant)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Inscription nouvelle ecole avec admin' }),
    (0, swagger_1.ApiBody)({ type: register_school_dto_1.RegisterSchoolDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Ecole creee avec succes' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Slug existe deja' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_school_dto_1.RegisterSchoolDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Rafraichir token d acces' }),
    __param(0, (0, common_1.Body)('refreshToken')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentification'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map