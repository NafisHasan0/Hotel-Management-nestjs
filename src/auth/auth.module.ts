import { Module } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { JwtModule } from '@nestjs/jwt';
  import { PassportModule } from '@nestjs/passport';
  import { JwtStrategy } from './jwt.strategy';
  import { RolesGuard } from './roles.guard';
  import { ConfigModule, ConfigService } from '@nestjs/config';
  import { AuthController } from './auth.controller';
import { ManagementModule } from 'src/management/management.module';
import { UserModule } from 'src/user/user.module';



  @Module({
    imports: [
      PassportModule,ManagementModule, UserModule,
      JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '60m' },
        }),
        inject: [ConfigService],
      }),
      ConfigModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, RolesGuard],
    exports: [AuthService, RolesGuard,],
  })
  export class AuthModule {}