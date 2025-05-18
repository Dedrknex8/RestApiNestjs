import { Body, Controller, Post, Put } from '@nestjs/common';
import { RegisterDto } from './dto/register.user.dto';
import { User as UserEntity } from './entity/user.entities';
import { AuthService } from './auth.service';
import { register } from 'module';

@Controller('auth')
export class AuthController {
    constructor(private readonly authservice: AuthService){}


@Post('register')
async RegisterUser(@Body() RegisterDto : RegisterDto){
    return this.authservice.registerUser(RegisterDto)
}
}

