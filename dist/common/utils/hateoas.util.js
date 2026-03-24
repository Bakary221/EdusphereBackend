"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLinks = generateLinks;
function generateLinks(request, route) {
    const { protocol, headers, originalUrl } = request;
    const host = headers.host;
    const baseUrl = `${protocol}://${host}`;
    const self = `${baseUrl}${originalUrl}`;
    const links = {
        self,
    };
    switch (route) {
        case '/auth/login':
            links.refresh = `${baseUrl}/auth/refresh`;
            links.profile = `${baseUrl}/auth/me`;
            links.logout = `${baseUrl}/auth/logout`;
            break;
        case '/auth/me':
            links.updateProfile = `${baseUrl}/auth/me`;
            links.logout = `${baseUrl}/auth/logout`;
            break;
        case '/schools':
            links.createSchool = `${baseUrl}/schools`;
            links.listSchools = `${baseUrl}/schools`;
            break;
    }
    return links;
}
//# sourceMappingURL=hateoas.util.js.map