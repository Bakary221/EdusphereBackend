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
exports.RegisterSchoolDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const school_types_1 = require("../../../common/constants/school-types");
class RegisterSchoolDto {
}
exports.RegisterSchoolDto = RegisterSchoolDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Lycée Moderne', description: "Nom de l'ecole" }),
    (0, class_validator_1.IsString)({ message: 'Le nom de l\'école doit être une chaîne de caractères' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom de l\'école est obligatoire' }),
    __metadata("design:type", String)
], RegisterSchoolDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'lycee-moderne', description: "Slug unique de l'ecole (3-50 chars)" }),
    (0, class_validator_1.IsString)({ message: 'Le slug doit être une chaîne de caractères' }),
    (0, class_validator_1.Length)(3, 50, { message: 'Le slug doit contenir entre 3 et 50 caractères' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le slug est obligatoire' }),
    __metadata("design:type", String)
], RegisterSchoolDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ example: 'PRIVATE', enum: school_types_1.SCHOOL_TYPES }),
    (0, class_validator_1.IsIn)(school_types_1.SCHOOL_TYPES, { message: "Le type d'école n'est pas valide" }),
    __metadata("design:type", String)
], RegisterSchoolDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ example: 'free' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterSchoolDto.prototype, "plan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ example: 'contact@lycee-moderne.com', description: 'Email de contact école' }),
    (0, class_validator_1.IsEmail)({}, { message: 'L\'email de contact n\'est pas valide' }),
    __metadata("design:type", String)
], RegisterSchoolDto.prototype, "contactEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ example: 'admin@lycee-moderne.com', description: 'Email admin école' }),
    (0, class_validator_1.IsEmail)({}, { message: 'L\'email renseigné n\'est pas valide' }),
    __metadata("design:type", String)
], RegisterSchoolDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Admin' }),
    (0, class_validator_1.IsString)({ message: 'Le prénom de l\'admin doit être une chaîne de caractères' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le prénom de l\'admin est obligatoire' }),
    __metadata("design:type", String)
], RegisterSchoolDto.prototype, "adminFirstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Diop' }),
    (0, class_validator_1.IsString)({ message: 'Le nom de l\'admin doit être une chaîne de caractères' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom de l\'admin est obligatoire' }),
    __metadata("design:type", String)
], RegisterSchoolDto.prototype, "adminLastName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ example: '+221 77 123 45 67' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterSchoolDto.prototype, "adminPhone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ example: 'Dakar' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterSchoolDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ example: 'Sénégal' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterSchoolDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ example: 'Avenue Cheikh Anta Diop' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterSchoolDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ example: 'Une école tournée vers l’excellence.' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterSchoolDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://res.cloudinary.com/.../logo.png' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterSchoolDto.prototype, "logo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ example: '#3b82f6' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterSchoolDto.prototype, "brandingColor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ example: '#10b981' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterSchoolDto.prototype, "brandingSecondaryColor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({ example: 'Excellence académique pour tous' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterSchoolDto.prototype, "brandingSlogan", void 0);
//# sourceMappingURL=register-school.dto.js.map