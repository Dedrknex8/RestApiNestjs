import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "../entity/user.entities";
import { ROLES_KEY } from "../Decorators/roles.decorators";

@Injectable()
export class RolesGuards implements CanActivate{
    constructor(private reflector : Reflector){}

    canActivate(context: ExecutionContext): boolean  {
        
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY, [
                context.getHandler(), //method level metadata
                context.getClass() //class level metadata
            ]
        )

        //if requiredRoles is not requried that means the route is accessible to any user
        if(!requiredRoles){
            return true
        }

        //get current user

        const {user} = context.switchToHttp().getRequest();

        if(!user){
            throw new ForbiddenException('User is not authenticated')
        }

        const hasRequiredRole = requiredRoles.some(role=> user.role === role);
        
        if(!hasRequiredRole){
            throw new ForbiddenException('Invalid permission')
        }

        return true
    }
}