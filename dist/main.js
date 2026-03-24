"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('EduSphere Central API')
        .setDescription('API centrale Edusphere - Gestion écoles/lycées, emplois du temps, notes, paiements...\n\n**Seed users (Password123!):**\n• superadmin@edusphere.sn (SUPER_ADMIN)\n• admin@lycee-excellence.sn (SCHOOL_ADMIN)\n• teacher/student/parent/comptable@lycee-excellence.sn')
        .setVersion('1.0')
        .addServer('http://localhost:3000', 'Development')
        .addServer('https://api.edusphere.sn', 'Production')
        .addBearerAuth({
        description: `JWT Bearer auth.\nEx: POST /api/v1/auth/login → {"email": "superadmin@edusphere.sn", "password": "Password123!"}`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        type: 'http',
        scheme: 'bearer',
        in: 'header',
    })
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api-docs', app, document);
    await app.listen(process.env.PORT || 3000);
    console.log('🚀 Backend running on http://localhost:3000');
    console.log('📚 API: http://localhost:3000/api/v1');
    console.log('🔍 Health: http://localhost:3000/api/v1/health');
    console.log('🔐 Login: http://localhost:3000/api/v1/auth/login');
    console.log('📖 Swagger: http://localhost:3000/api-docs');
}
bootstrap();
//# sourceMappingURL=main.js.map