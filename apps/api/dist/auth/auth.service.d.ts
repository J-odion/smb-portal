import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User, Tenant } from '../schemas/index.js';
export declare class AuthService {
    private userModel;
    private tenantModel;
    private jwtService;
    constructor(userModel: Model<User>, tenantModel: Model<Tenant>, jwtService: JwtService);
    signup(email: string, passwordPlain: string, businessName: string): Promise<{
        access_token: string;
    }>;
    login(email: string, passwordPlain: string): Promise<{
        access_token: string;
    }>;
    private generateTokens;
}
