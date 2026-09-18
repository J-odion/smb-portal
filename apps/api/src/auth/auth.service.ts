import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async signup(email: string, passwordPlain: string, businessName: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(passwordPlain, 10);

    // Create Tenant and Owner user in one transaction
    const tenant = await this.prisma.tenant.create({
      data: {
        business_name: businessName,
        users: {
          create: {
            email,
            password: hashedPassword
          }
        }
      },
      include: {
        users: true
      }
    });

    const user = tenant.users[0];
    return this.generateTokens(user.id, user.email, user.tenant_id);
  }

  async login(email: string, passwordPlain: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(passwordPlain, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.email, user.tenant_id);
  }

  private generateTokens(userId: string, email: string, tenantId: string) {
    const payload = { sub: userId, email, tenantId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
