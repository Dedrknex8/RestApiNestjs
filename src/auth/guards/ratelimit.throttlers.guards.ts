import { ForbiddenException, Injectable } from "@nestjs/common";
import { ThrottlerException, ThrottlerGuard } from "@nestjs/throttler";


@Injectable()
export class LoginThrottlerClass extends ThrottlerGuard{
    protected async getTracker(req: Record<string, any>): Promise<string> {
        const email = req.body?.email || 'anonymous'

        if(!email){
            throw new ForbiddenException('Email is requried');
        }
        return `loginemail:${email}`
    } 
    // custom limit
    protected getLimit() : Promise<number>{
        console.log('This custom ttl is working')
        
        return Promise.resolve(1)
    }

    //window time of 5  min => blocked for 5 Min
    protected getTtl() : Promise<number>{
        return Promise.resolve(60000)
    }

    //custom message that to be displayed on userProfile

    protected async throwThrottlingException() : Promise<void>{
        throw new ThrottlerException('Too many request wait for some time')
    }
} 