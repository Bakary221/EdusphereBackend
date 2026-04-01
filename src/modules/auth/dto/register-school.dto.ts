import { IsEmail, IsString, IsNotEmpty, Length, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SchoolType } from '@prisma/client';

export class RegisterSchoolDto {
  @ApiProperty({ example: 'Lycée Moderne', description: "Nom de l'ecole" })
  @IsString({ message: 'Le nom de l\'école doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom de l\'école est obligatoire' })
  name: string;

  @ApiProperty({ example: 'lycee-moderne', description: "Slug unique de l'ecole (3-50 chars)" })
  @IsString({ message: 'Le slug doit être une chaîne de caractères' })
  @Length(3, 50, { message: 'Le slug doit contenir entre 3 et 50 caractères' })
  @IsNotEmpty({ message: 'Le slug est obligatoire' })
  slug: string;

  @ApiProperty({ example: 'PRIVATE', enum: SchoolType, required: false })
  @IsEnum(SchoolType)
  @IsOptional()
  type?: SchoolType;

  @ApiProperty({ example: 'free', required: false })
  @IsString()
  @IsOptional()
  plan?: string;

  @ApiProperty({ example: 'contact@lycee-moderne.com', description: 'Email de contact école' })
  @IsEmail({}, { message: 'L\'email de contact n\'est pas valide' })
  @IsNotEmpty({ message: 'L\'email de contact est obligatoire' })
  email: string;

  @ApiProperty({ example: 'admin@lycee-moderne.com', description: 'Email admin école' })
  @IsEmail({}, { message: 'L\'email admin n\'est pas valide' })
  @IsNotEmpty({ message: 'L\'email admin est obligatoire' })
  adminEmail: string;

  @ApiProperty({ example: 'Admin' })
  @IsString({ message: 'Le prénom de l\'admin doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le prénom de l\'admin est obligatoire' })
  adminFirstName: string;

  @ApiProperty({ example: 'Diop' })
  @IsString({ message: 'Le nom de l\'admin doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom de l\'admin est obligatoire' })
  adminLastName: string;

}
