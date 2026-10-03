import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/auth.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(body: SignupDto): Promise<{
        access_token: string;
    }>;
    login(body: LoginDto): Promise<{
        access_token: string;
    }>;
}
