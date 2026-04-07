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
const isPrismaErrorLike = (value) => {
    return !!value && typeof value === 'object' && 'code' in value && typeof value.code === 'string';
};
const getPrismaUniqueConstraintMessage = (target, locale) => {
    const normalizedTarget = target.map((field) => field.toLowerCase());
    if (normalizedTarget.includes('email')) {
        return locale === 'fr'
            ? 'Cette adresse e-mail existe déjà.'
            : 'This email address already exists.';
    }
    if (normalizedTarget.includes('slug')) {
        return locale === 'fr'
            ? 'Ce slug existe déjà.'
            : 'This slug already exists.';
    }
    if (normalizedTarget.includes('code')) {
        return locale === 'fr'
            ? 'Ce code existe déjà.'
            : 'This code already exists.';
    }
    if (normalizedTarget.includes('name')) {
        return locale === 'fr'
            ? 'Un élément avec ce nom existe déjà.'
            : 'An item with this name already exists.';
    }
    if (normalizedTarget.includes('token')) {
        return locale === 'fr'
            ? 'Ce jeton existe déjà.'
            : 'This token already exists.';
    }
    return locale === 'fr'
        ? 'Un élément avec ces valeurs existe déjà.'
        : 'An item with these values already exists.';
};
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
        if (isPrismaErrorLike(exception)) {
            const target = Array.isArray(exception.meta?.target)
                ? exception.meta.target.filter((item) => typeof item === 'string')
                : [];
            if (exception.code === 'P2002') {
                status = common_1.HttpStatus.CONFLICT;
                code = error_codes_enum_1.ErrorCode.CONFLICT;
                message = getPrismaUniqueConstraintMessage(target, locale);
                details = target.length > 0 ? [`Champs concernés : ${target.join(', ')}`] : [];
            }
            else if (exception.code === 'P2025') {
                status = common_1.HttpStatus.NOT_FOUND;
                code = error_codes_enum_1.ErrorCode.NOT_FOUND;
                message = error_messages_1.ErrorMessages[error_codes_enum_1.ErrorCode.NOT_FOUND][locale];
            }
            else if (exception.code === 'P2003') {
                status = common_1.HttpStatus.BAD_REQUEST;
                code = error_codes_enum_1.ErrorCode.BAD_REQUEST;
                message =
                    locale === 'fr'
                        ? 'La référence liée est invalide.'
                        : 'The related reference is invalid.';
            }
        }
        else if (exception instanceof common_1.HttpException) {
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