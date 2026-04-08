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
exports.AuthRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const tenant_database_service_1 = require("../../database/tenant-database.service");
const tenant_provisioning_service_1 = require("../../database/tenant-provisioning.service");
let AuthRepository = class AuthRepository {
    constructor(prisma, tenantDatabaseService, tenantProvisioningService) {
        this.prisma = prisma;
        this.tenantDatabaseService = tenantDatabaseService;
        this.tenantProvisioningService = tenantProvisioningService;
    }
    async resolvePrismaClient(tenant) {
        if (tenant) {
            return this.tenantDatabaseService.getClientForTenant(tenant);
        }
        return this.prisma;
    }
    isSchemaMismatchError(error) {
        if (!error || typeof error !== 'object' || !('code' in error) || typeof error.code !== 'string') {
            return false;
        }
        return error.code === 'P2021' || error.code === 'P2022';
    }
    async withTenantSchemaRepair(tenant, operation) {
        try {
            return await operation();
        }
        catch (error) {
            if (!tenant || !this.isSchemaMismatchError(error)) {
                throw error;
            }
            await this.tenantProvisioningService.syncTenantSchema(tenant.databaseUrl, tenant.slug);
            return operation();
        }
    }
    async findUserByEmail(email, tenant) {
        const prisma = await this.resolvePrismaClient(tenant);
        return this.withTenantSchemaRepair(tenant ?? null, () => prisma.user.findFirst({
            where: {
                email,
            },
        }));
    }
    async findUserById(id, tenant) {
        const prisma = await this.resolvePrismaClient(tenant);
        return this.withTenantSchemaRepair(tenant ?? null, () => prisma.user.findUnique({ where: { id } }));
    }
    async findSchoolBySlug(slug) {
        return this.prisma.school.findUnique({ where: { slug } });
    }
    async findSchoolById(id) {
        return this.prisma.school.findUnique({ where: { id } });
    }
    async createUser(data) {
        return this.prisma.user.create({ data });
    }
    async updateUser(id, data) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }
    async createSchoolWithAdmin(data) {
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
            };
            const school = await tx.school.create({
                data: schoolData,
            });
            const tenant = {
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
    async findSessionByRefreshToken(token, tenant) {
        const prisma = await this.resolvePrismaClient(tenant);
        return this.withTenantSchemaRepair(tenant, () => prisma.session.findUnique({ where: { refreshToken: token } }));
    }
    async createSession(data, tenant) {
        const prisma = await this.resolvePrismaClient(tenant);
        return this.withTenantSchemaRepair(tenant, () => prisma.session.create({ data }));
    }
    async deleteSessionById(id, tenant) {
        const prisma = await this.resolvePrismaClient(tenant);
        return this.withTenantSchemaRepair(tenant, () => prisma.session.delete({ where: { id } }));
    }
    async deleteUserSessions(userId, tenant) {
        const prisma = await this.resolvePrismaClient(tenant);
        await this.withTenantSchemaRepair(tenant, () => prisma.session.deleteMany({ where: { userId } }));
    }
    async listSchools() {
        return this.prisma.school.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async updateSchoolStatus(id, status) {
        return this.prisma.school.update({
            where: { id },
            data: { status },
        });
    }
};
exports.AuthRepository = AuthRepository;
exports.AuthRepository = AuthRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenant_database_service_1.TenantDatabaseService,
        tenant_provisioning_service_1.TenantProvisioningService])
], AuthRepository);
//# sourceMappingURL=auth.repository.js.map