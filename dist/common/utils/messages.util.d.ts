import { ErrorCode } from '../enums/error-codes.enum';
import { SuccessMessage } from '../enums/success-messages.enum';
export type Locale = 'fr' | 'en';
export declare function getErrorMessage(code: ErrorCode, locale?: Locale): string;
export declare function getSuccessMessage(code: SuccessMessage, locale?: Locale): string;
export declare function createErrorResponse(code: ErrorCode, details?: string[], locale?: Locale): {
    details: string[];
    code: ErrorCode;
    message: string;
};
