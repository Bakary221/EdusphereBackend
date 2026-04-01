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
const client_1 = require("@prisma/client");
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
    (0, swagger_1.ApiProperty)({ example: 'PRIVATE', enum: client_1.SchoolType, required: false }),
    (0, class_validator_1.IsEnum)(client_1.SchoolType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterSchoolDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'free', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterSchoolDto.prototype, "plan", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'contact@lycee-moderne.com', description: 'Email de contact école' }),
    (0, class_validator_1.IsEmail)({}, { message: 'L\'email de contact n\'est pas valide' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'email de contact est obligatoire' }),
    __metadata("design:type", String)
], RegisterSchoolDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin@lycee-moderne.com', description: 'Email admin école' }),
    (0, class_validator_1.IsEmail)({}, { message: 'L\'email admin n\'est pas valide' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'email admin est obligatoire' }),
    __metadata("design:type", String)
], RegisterSchoolDto.prototype, "adminEmail", void 0);
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
//# sourceMappingURL=register-school.dto.js.map