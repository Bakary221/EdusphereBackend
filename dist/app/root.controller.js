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
exports.RootController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const swagger_1 = require("@nestjs/swagger");
let RootController = class RootController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async root() {
        let dbStatus = 'unavailable';
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            dbStatus = 'ok';
        }
        catch (error) {
            console.error('DB check failed:', error);
            dbStatus = 'error';
        }
        return {
            message: 'Welcome to EduSphere API',
            version: '1.0.0',
            status: 'healthy',
            database: dbStatus,
            endpoints: {
                health: '/api/health',
                auth: '/api/auth/login',
                docs: '/api-docs',
            },
        };
    }
    async status() {
        return {
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            env: process.env.NODE_ENV || 'development',
        };
    }
};
exports.RootController = RootController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Accueil API EduSphere' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Accueil et statut API' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RootController.prototype, "root", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Statut serveur' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statut serveur détaillé' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RootController.prototype, "status", null);
exports.RootController = RootController = __decorate([
    (0, swagger_1.ApiTags)('API'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RootController);
//# sourceMappingURL=root.controller.js.map