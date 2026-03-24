"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessMessages = void 0;
const success_messages_enum_1 = require("../enums/success-messages.enum");
exports.SuccessMessages = {
    [success_messages_enum_1.SuccessMessage.LOGIN_SUCCESS]: {
        fr: 'Connexion réussie',
        en: 'Login successful'
    },
    [success_messages_enum_1.SuccessMessage.REGISTER_SUCCESS]: {
        fr: 'École créée avec succès',
        en: 'School created successfully'
    },
    [success_messages_enum_1.SuccessMessage.REFRESH_SUCCESS]: {
        fr: 'Tokens rafraîchis',
        en: 'Tokens refreshed'
    },
    [success_messages_enum_1.SuccessMessage.LOGOUT_SUCCESS]: {
        fr: 'Déconnexion réussie',
        en: 'Logout successful'
    },
    [success_messages_enum_1.SuccessMessage.PROFILE_FETCHED]: {
        fr: 'Profil récupéré',
        en: 'Profile fetched'
    },
    [success_messages_enum_1.SuccessMessage.OPERATION_SUCCESS]: {
        fr: 'Opération réussie',
        en: 'Operation successful'
    },
};
//# sourceMappingURL=success-messages.js.map