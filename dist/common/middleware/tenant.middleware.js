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
exports.TenantMiddleware = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../database/prisma.service");
const error_codes_enum_1 = require("../enums/error-codes.enum");
const messages_util_1 = require("../utils/messages.util");
let TenantMiddleware = class TenantMiddleware {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
    async use(req, res, next) {
        try {
            const slug = req.headers['x-tenant-slug'];
            if (!slug || slug.trim() === '') {
                req.school = null;
                const hostnameSlug = this.extractSlugFromHostname(req.hostname);
                if (!hostnameSlug) {
                    return next();
                }
                await this.attachTenant(hostnameSlug, req);
                return next();
            }
            const normalizedSlug = slug.trim().toLowerCase();
            await this.attachTenant(normalizedSlug, req);
            return next();
        }
        catch (error) {
            this.sendErrorResponse(res, error);
        }
    }
    async attachTenant(normalizedSlug, req) {
        const slug = normalizedSlug;
        let school;
        try {
            school = await this.prisma.school.findUnique({
                where: { slug },
                select: {
                    id: true,
                    slug: true,
                    name: true,
                    status: true,
                    plan: true,
                    databaseUrl: true,
                },
            });
        }
        catch (error) {
            throw new common_1.ServiceUnavailableException('La base centrale est temporairement indisponible.');
        }
        if (!school) {
            throw new common_1.NotFoundException({
                code: error_codes_enum_1.ErrorCode.TENANT_NOT_FOUND,
                message: (0, messages_util_1.getErrorMessage)(error_codes_enum_1.ErrorCode.TENANT_NOT_FOUND),
            });
        }
        if (school.status !== 'ACTIVE') {
            throw new common_1.ForbiddenException({
                code: error_codes_enum_1.ErrorCode.TENANT_SUSPENDED,
                message: (0, messages_util_1.getErrorMessage)(error_codes_enum_1.ErrorCode.TENANT_SUSPENDED),
            });
        }
        req.school = school;
    }
    sendErrorResponse(res, error) {
        if (error instanceof common_1.HttpException) {
            const status = error.getStatus();
            const response = error.getResponse();
            const payload = typeof response === 'object' && response !== null
                ? response
                : {};
            const code = typeof payload.code === 'string'
                ? payload.code
                : 'INTERNAL_ERROR';
            const message = typeof payload.message === 'string'
                ? payload.message
                : typeof response === 'string'
                    ? response
                    : error.message;
            const details = Array.isArray(payload.details)
                ? payload.details.filter((detail) => typeof detail === 'string')
                : [];
            res.status(status).json({
                error: {
                    code,
                    message,
                    details,
                },
                _links: {
                    documentation: '/api/docs#errors',
                },
            });
            return;
        }
        res.status(503).json({
            error: {
                code: 'INTERNAL_ERROR',
                message: 'La base centrale est temporairement indisponible.',
                details: [],
            },
            _links: {
                documentation: '/api/docs#errors',
            },
        });
    }
    extractSlugFromHostname(hostname) {
        if (!hostname)
            return null;
        const baseDomain = this.config.get('TENANT_BASE_DOMAIN')?.trim().toLowerCase();
        const normalizedHostname = hostname.split(':')[0].toLowerCase();
        if (!baseDomain || !baseDomain.length) {
            return null;
        }
        if (normalizedHostname === baseDomain) {
            return null;
        }
        if (!normalizedHostname.endsWith(baseDomain)) {
            return null;
        }
        const slugPart = normalizedHostname.slice(0, normalizedHostname.length - baseDomain.length);
        const cleaned = slugPart.replace(/\.$/, '').replace(/^\./, '');
        return cleaned.length > 0 ? cleaned : null;
    }
};
exports.TenantMiddleware = TenantMiddleware;
exports.TenantMiddleware = TenantMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], TenantMiddleware);
//# sourceMappingURL=tenant.middleware.js.map