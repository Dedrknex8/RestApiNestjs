import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportModule, PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt'
import { AuthService } from "../auth.service";
@Injectable()
export class JwtStratergy extends PassportStrategy(Strategy){
    constructor(private authservice : AuthService){
        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration : false,
            secretOrKey : 'JwtSecret'
        });
    }

    async validate(payload  : any) {
        try {

            const user = await this.authservice.getUserById(payload.id);
            
            return {
                ...user,
                role : user.role //this will get us role and will verify this role to check if admin or not
            }
        } catch (error) {
            throw new UnauthorizedException('Invalid Token')
        }
    }
}