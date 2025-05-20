import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entities';
import {JwtModule} from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
     JwtModule.registerAsync({
      imports : [ConfigModule],
      useFactory : async(ConfigService: ConfigService)=>({
        secret : ConfigService.getOrThrow('JWT_SECRET'),
        signOptions: {expiresIn: '1h'}
      }),
       inject: [ConfigService]
    }),
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
