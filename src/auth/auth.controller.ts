import { Body, Controller, Post, Put } from '@nestjs/common';
import { RegisterDto } from './dto/register.user.dto';
import { User as UserEntity } from './entity/user.entities';
import { AuthService } from './auth.service';
import { register } from 'module';
import { LoginDto } from './dto/login.user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authservice: AuthService){}


@Post('register')
async RegisterUser(@Body() RegisterDto : RegisterDto){
    return this.authservice.registerUser(RegisterDto)
}

@Post('login')
async loginUser(@Body() LoginDto:LoginDto){
    return this.authservice.loginUser(LoginDto)
}

@Post('refresh-token')
    async refreshAccessToken(@Body('refreshToken') refreshToken : string ){
        const token = this.authservice.refreshToken(refreshToken)
        return token;
    }
}

