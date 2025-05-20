import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

//project routes that requires authentication 
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){}