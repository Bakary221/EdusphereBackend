"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const error_codes_enum_1 = require("../enums/error-codes.enum");
const error_messages_1 = require("../i18n/error-messages");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const acceptLanguage = request.headers['accept-language']?.split(',')[0] || 'fr';
        const locale = (acceptLanguage.startsWith('fr') ? 'fr' : 'en');
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let code = error_codes_enum_1.ErrorCode.INTERNAL_ERROR;
        let message = error_messages_1.ErrorMessages[error_codes_enum_1.ErrorCode.INTERNAL_ERROR][locale];
        let details = [];
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'object' && exceptionResponse.code) {
                const exceptionCode = exceptionResponse.code;
                code = exceptionCode in error_messages_1.ErrorMessages ? exceptionCode : error_codes_enum_1.ErrorCode.INTERNAL_ERROR;
                message = error_messages_1.ErrorMessages[code][locale];
                details = exceptionResponse.details || [];
            }
            else {
                const msg = typeof exceptionResponse === 'string' ? exceptionResponse : exceptionResponse.message;
                code = status.toString();
                message = Array.isArray(msg) ? msg[0] : msg;
                details = Array.isArray(msg) ? msg.slice(1) : [];
            }
        }
        const errorResponse = {
            error: {
                code,
                message,
                details,
            },
            _links: {
                documentation: '/api/docs#errors',
            },
        };
        response.status(status).json(errorResponse);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map