"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessages = void 0;
const error_codes_enum_1 = require("../enums/error-codes.enum");
exports.ErrorMessages = {
    [error_codes_enum_1.ErrorCode.INTERNAL_ERROR]: {
        fr: 'Une erreur interne est survenue',
        en: 'An internal error occurred'
    },
    [error_codes_enum_1.ErrorCode.NOT_FOUND]: {
        fr: 'Ressource non trouvée',
        en: 'Resource not found'
    },
    [error_codes_enum_1.ErrorCode.BAD_REQUEST]: {
        fr: 'Mauvaise requête',
        en: 'Bad request'
    },
    [error_codes_enum_1.ErrorCode.UNAUTHORIZED]: {
        fr: 'Non autorisé',
        en: 'Unauthorized'
    },
    [error_codes_enum_1.ErrorCode.FORBIDDEN]: {
        fr: 'Accès interdit',
        en: 'Forbidden'
    },
    [error_codes_enum_1.ErrorCode.CONFLICT]: {
        fr: 'Conflit de ressources',
        en: 'Conflict'
    },
    [error_codes_enum_1.ErrorCode.VALIDATION_ERROR]: {
        fr: 'Erreur de validation',
        en: 'Validation error'
    },
    [error_codes_enum_1.ErrorCode.AUTH_INVALID_CREDENTIALS]: {
        fr: 'Email ou mot de passe incorrect',
        en: 'Invalid email or password'
    },
    [error_codes_enum_1.ErrorCode.AUTH_ACCOUNT_INACTIVE]: {
        fr: 'Votre compte est désactivé',
        en: 'Your account is inactive'
    },
    [error_codes_enum_1.ErrorCode.AUTH_INVALID_REFRESH_TOKEN]: {
        fr: 'Token de rafraîchissement invalide ou expiré',
        en: 'Invalid or expired refresh token'
    },
    [error_codes_enum_1.ErrorCode.AUTH_USER_NOT_FOUND]: {
        fr: 'Utilisateur non trouvé',
        en: 'User not found'
    },
    [error_codes_enum_1.ErrorCode.SCHOOL_SLUG_EXISTS]: {
        fr: `Ce slug d'ecole existe déjà`,
        en: 'School slug already exists'
    },
    [error_codes_enum_1.ErrorCode.TENANT_NOT_FOUND]: {
        fr: 'Aucune école trouvée pour ce sous-domaine',
        en: 'No school found for this subdomain'
    },
    [error_codes_enum_1.ErrorCode.TENANT_SUSPENDED]: {
        fr: 'Cette école est suspendue ou en attente de validation',
        en: 'This school is suspended or pending validation'
    },
    [error_codes_enum_1.ErrorCode.THROTTLE_EXCEEDED]: {
        fr: 'Trop de requêtes. Réessayez dans un moment.',
        en: 'Too many requests. Try again later.'
    },
};
//# sourceMappingURL=error-messages.js.map