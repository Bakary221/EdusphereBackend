import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { AuthRepository } from '../auth.repository';
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    private authRepository;
    constructor(authService: AuthService, authRepository: AuthRepository);
    validate(email: string, password: string): Promise<any>;
}
export {};
