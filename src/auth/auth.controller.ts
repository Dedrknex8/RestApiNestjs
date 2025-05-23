import { Body, Controller, Get, Post, Put, UnauthorizedException, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.user.dto';
import { Role, User as UserEntity } from './entity/user.entities';
import { AuthService } from './auth.service';
import { register } from 'module';
import { LoginDto } from './dto/login.user.dto';
import { JwtAuthGuard } from './guards/auth.guard';
import { getCurrentUser } from './Decorators/user.decorator';
import { Roles } from './Decorators/roles.decorators';
import { RolesGuards } from './guards/role.guard';
import { LoginThrottlerClass } from './guards/ratelimit.throttlers.guards';
// import { SkipThrottle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(private readonly authservice: AuthService){}


@Post('register')
async RegisterUser(@Body() RegisterDto : RegisterDto){
    return this.authservice.registerUser(RegisterDto)
}


@Post('login')
@UseGuards(LoginThrottlerClass)
async loginUser(@Body() LoginDto:LoginDto){
    return this.authservice.loginUser(LoginDto)
}

@Post('refresh-token')
    async refreshAccessToken(@Body('refreshToken') refreshToken : string ){
        const token = this.authservice.refreshToken(refreshToken)
        if(!token){
            throw new UnauthorizedException("TOken cannot be validated")
        }
        return token;
    }

@UseGuards(JwtAuthGuard)
@Get('profile')
getprofile(@getCurrentUser() user:any) {
    return user;
}

@Post('create-admin')
 @Roles(Role.Admin)
 @UseGuards(JwtAuthGuard,RolesGuards)
    createAdmin(@Body() registerDto:RegisterDto){
        return this.authservice.createAdminUser(registerDto)
    }
}

