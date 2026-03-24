import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterSchoolDto } from './dto/register-school.dto';
import { ITenant } from '@common/interfaces/tenant.interface';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, tenant: ITenant | null, req: any): Promise<{
        _links: {
            self: any;
            refresh: string;
            profile: string;
            logout: string;
        };
        tenant: {
            slug: string;
            name: string;
        };
        data: import("./auth.service").AuthResponse;
        message: string;
    }>;
    register(dto: RegisterSchoolDto, req: any): Promise<{
        data: {
            school: any;
            admin: any;
        };
        message: string;
        _links: {
            self: any;
            login: string;
        };
    }>;
    refresh(refreshToken: string, req: any): Promise<{
        data: import("./auth.service").AuthResponse;
        message: string;
        _links: {
            self: any;
            profile: string;
            logout: string;
        };
    }>;
    logout(userId: string, req: any): Promise<{
        data: any;
        message: string;
        _links: {
            self: any;
            login: string;
        };
    }>;
    getProfile(user: any, req: any): Promise<{
        data: any;
        message: string;
        _links: {
            self: any;
            logout: string;
        };
    }>;
}
