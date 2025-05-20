import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entities';
import {JwtModule, JwtService} from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesGuards } from './guards/role.guard';
import { JwtStratergy } from './startergies/jwt.startergy';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
     JwtModule.registerAsync({
      imports : [ConfigModule],
      useFactory : async(configService: ConfigService)=>({
        secret : configService.getOrThrow('JWT_SECRET'),
        signOptions: {expiresIn: '5m'}
      }),
       inject: [ConfigService]
    }),
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStratergy,RolesGuards],
  exports : [AuthService,RolesGuards]
})
export class AuthModule {}
