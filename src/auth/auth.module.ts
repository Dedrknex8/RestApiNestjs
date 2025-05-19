import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entities';
import {JwtModule} from '@nestjs/jwt'
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'JwtSecret',
      signOptions: { expiresIn: '15m' },
    }), 
],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
