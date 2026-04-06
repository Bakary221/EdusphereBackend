import { SchoolType } from '@common/constants/school-types';
export declare class RegisterSchoolDto {
    name: string;
    slug: string;
    type?: SchoolType;
    plan?: string;
    contactEmail?: string;
    email?: string;
    adminFirstName: string;
    adminLastName: string;
    adminPhone?: string;
    city?: string;
    country?: string;
    address?: string;
    description?: string;
    logo?: string;
    brandingColor?: string;
    brandingSecondaryColor?: string;
    brandingSlogan?: string;
}
