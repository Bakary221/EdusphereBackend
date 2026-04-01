import { SchoolType } from '@prisma/client';
export declare class RegisterSchoolDto {
    name: string;
    slug: string;
    type?: SchoolType;
    plan?: string;
    email: string;
    adminEmail: string;
    adminFirstName: string;
    adminLastName: string;
}
