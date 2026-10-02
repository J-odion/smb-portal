import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, Tenant } from '../schemas/index.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Tenant.name) private tenantModel: Model<Tenant>,
    private jwtService: JwtService
  ) {}

  async signup(email: string, passwordPlain: string, businessName: string) {
    const existing = await this.userModel.findOne({ email }).exec();
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(passwordPlain, 10);

    // Mongoose: create Tenant with 4-month trial
    const trialEnds = new Date();
    trialEnds.setMonth(trialEnds.getMonth() + 4);
    
    const tenant = await this.tenantModel.create({
      name: businessName,
      subscription_status: 'TRIAL',
      trial_ends_at: trialEnds
    });

    const user = await this.userModel.create({
      email,
      password_hash: hashedPassword,
      tenant_id: tenant._id,
      role: 'OWNER'
    });

    return this.generateTokens(user._id.toString(), user.email, tenant._id.toString(), user.role);
  }

  async login(email: string, passwordPlain: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(passwordPlain, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user._id.toString(), user.email, user.tenant_id.toString(), user.role);
  }

  private generateTokens(userId: string, email: string, tenantId: string, role: string) {
    const payload = { sub: userId, email, tenantId, role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
