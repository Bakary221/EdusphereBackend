"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCode = void 0;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["INTERNAL_ERROR"] = "INTERNAL_ERROR";
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["BAD_REQUEST"] = "BAD_REQUEST";
    ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ErrorCode["CONFLICT"] = "CONFLICT";
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCode["AUTH_INVALID_CREDENTIALS"] = "AUTH_INVALID_CREDENTIALS";
    ErrorCode["AUTH_ACCOUNT_INACTIVE"] = "AUTH_ACCOUNT_INACTIVE";
    ErrorCode["AUTH_INVALID_REFRESH_TOKEN"] = "AUTH_INVALID_REFRESH_TOKEN";
    ErrorCode["AUTH_USER_NOT_FOUND"] = "AUTH_USER_NOT_FOUND";
    ErrorCode["SCHOOL_SLUG_EXISTS"] = "SCHOOL_SLUG_EXISTS";
    ErrorCode["TENANT_NOT_FOUND"] = "TENANT_NOT_FOUND";
    ErrorCode["TENANT_SUSPENDED"] = "TENANT_SUSPENDED";
    ErrorCode["THROTTLE_EXCEEDED"] = "THROTTLE_EXCEEDED";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
//# sourceMappingURL=error-codes.enum.js.map