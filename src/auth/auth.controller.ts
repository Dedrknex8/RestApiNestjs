import { Body, Controller, Get, Post, Put, Req, UnauthorizedException, UseGuards ,Res} from '@nestjs/common';
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
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
// import { SkipThrottle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(private readonly authservice: AuthService){}

// @Get('csrf-token')
// getCsrfToken(@Req() req:Request,@Res() res:Response){
//     const token = req.csrfToken();
//     res.json({csrfToken : token});
// }




  
@Post('login')
@UseGuards(LoginThrottlerClass)
async loginUser(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
  return this.authservice.loginUser(loginDto,res)
}
  


// @Post('refresh-token')
//     async refreshAccessToken(@Body('refreshToken') refreshToken : string ){
//         const token = this.authservice.refreshToken(refreshToken)
//         if(!token){
//             throw new UnauthorizedException("TOken cannot be validated")
//         }
//         return token;
//     }

@Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const tokens = await this.authservice.validateOAuthLogin(req.user);

    // You can also emit an event like loginUser()
    res.cookie('access_token', tokens.accessToken, { httpOnly: true });
    res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
    
    // Optional: redirect to frontend with token or user info
    res.redirect('http://localhost:4200/dashboard');
  }
@Post('refresh-token')
async refreshAccessToken(@Req() req: Request) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
    }
    return this.authservice.refreshToken(refreshToken);
}
@UseGuards(JwtAuthGuard)
@Get('profile')
getprofile(@Req() req:Request) {
    return {message : 'This is a protected route',user: req.user};
}

@Post('create-admin')
 @Roles(Role.Admin)
 @UseGuards(JwtAuthGuard,RolesGuards)
    createAdmin(@Body() registerDto:RegisterDto){
        return this.authservice.createAdminUser(registerDto)
    }
@Post('register')
    registerUser(@Body() registerDto : RegisterDto){
        return this.authservice.registerUser(registerDto)
    }
}

