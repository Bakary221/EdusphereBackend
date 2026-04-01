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
exports.JwtStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../../database/prisma.service");
const tenant_database_service_1 = require("../../../database/tenant-database.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService, prisma, tenantDatabaseService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
        this.configService = configService;
        this.prisma = prisma;
        this.tenantDatabaseService = tenantDatabaseService;
    }
    async validate(payload) {
        let tenant = null;
        let prismaClient = this.prisma;
        if (payload.schoolId) {
            const school = await this.prisma.school.findUnique({
                where: { id: payload.schoolId },
                select: {
                    id: true,
                    slug: true,
                    name: true,
                    status: true,
                    plan: true,
                    databaseUrl: true,
                },
            });
            if (!school) {
                throw new common_1.UnauthorizedException('Tenant introuvable');
            }
            if (school.status !== 'ACTIVE') {
                throw new common_1.UnauthorizedException('Tenant inactif');
            }
            tenant = school;
            prismaClient = await this.tenantDatabaseService.getClientForTenant(tenant);
        }
        const user = await prismaClient.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                email: true,
                role: true,
                isActive: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Utilisateur introuvable');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Compte désactivé');
        }
        return {
            id: user.id,
            sub: user.id,
            email: user.email,
            role: user.role,
            schoolId: payload.schoolId ?? null,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        tenant_database_service_1.TenantDatabaseService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map