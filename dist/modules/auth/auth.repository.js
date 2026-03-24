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
var AuthRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let AuthRepository = AuthRepository_1 = class AuthRepository {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AuthRepository_1.name);
    }
    async findUserByEmail(email, schoolId) {
        return this.prisma.user.findFirst({
            where: {
                email,
                ...(schoolId && { schoolId }),
            },
        });
    }
    async findUserById(id) {
        return this.prisma.user.findUnique({ where: { id } });
    }
    async findSchoolBySlug(slug) {
        return this.prisma.school.findUnique({ where: { slug } });
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
    async findSessionByRefreshToken(token) {
        return this.prisma.session.findUnique({ where: { refreshToken: token } });
    }
    async createSession(data) {
        return this.prisma.session.create({ data });
    }
    async deleteSessionById(id) {
        return this.prisma.session.delete({ where: { id } });
    }
    async deleteUserSessions(userId) {
        await this.prisma.session.deleteMany({ where: { userId } });
    }
};
exports.AuthRepository = AuthRepository;
exports.AuthRepository = AuthRepository = AuthRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthRepository);
//# sourceMappingURL=auth.repository.js.map