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
exports.TransformInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const hateoas_util_1 = require("../utils/hateoas.util");
let TransformInterceptor = class TransformInterceptor {
    constructor() { }
    intercept(context, next) {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const route = request.route?.path || '';
        return next
            .handle()
            .pipe((0, operators_1.map)((data) => {
            if (typeof data === 'string' || (data && data.status === 'ok')) {
                return data;
            }
            const links = (0, hateoas_util_1.generateLinks)(request, route);
            const apiLinks = { ...links, self: links.self || `${request.protocol}://${request.headers.host}${request.originalUrl}` };
            const meta = request.query.page
                ? {
                    total: data.total || 0,
                    page: parseInt(request.query.page) || 1,
                    limit: parseInt(request.query.limit) || 10,
                }
                : undefined;
            const apiResponse = {
                data: data.data || data,
                meta,
                _links: apiLinks,
            };
            return apiResponse;
        }));
    }
};
exports.TransformInterceptor = TransformInterceptor;
exports.TransformInterceptor = TransformInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TransformInterceptor);
//# sourceMappingURL=transform.interceptor.js.map