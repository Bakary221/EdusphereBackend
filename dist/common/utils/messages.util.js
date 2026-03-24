"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = getErrorMessage;
exports.getSuccessMessage = getSuccessMessage;
exports.createErrorResponse = createErrorResponse;
const error_codes_enum_1 = require("../enums/error-codes.enum");
const success_messages_enum_1 = require("../enums/success-messages.enum");
const error_messages_1 = require("../i18n/error-messages");
const success_messages_1 = require("../i18n/success-messages");
function getErrorMessage(code, locale = 'fr') {
    return error_messages_1.ErrorMessages[code]?.[locale] || error_messages_1.ErrorMessages[error_codes_enum_1.ErrorCode.INTERNAL_ERROR][locale];
}
function getSuccessMessage(code, locale = 'fr') {
    return success_messages_1.SuccessMessages[code]?.[locale] || success_messages_1.SuccessMessages[success_messages_enum_1.SuccessMessage.OPERATION_SUCCESS][locale];
}
function createErrorResponse(code, details, locale = 'fr') {
    return {
        code,
        message: getErrorMessage(code, locale),
        ...(details && details.length > 0 && { details }),
    };
}
//# sourceMappingURL=messages.util.js.map