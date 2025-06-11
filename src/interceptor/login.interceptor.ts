import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { error } from "console";
import { Observable, tap } from "rxjs";


@Injectable()
export class LoggingInterceptor implements NestInterceptor{
    private readonly logger = new Logger(LoggingInterceptor.name);


    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const {method,url,body,query,params} = request
        const  userAgent = request.get('user-agent') || 'unknown';


        const userId = request?.user?.id || 'unauthenticated';

        this.logger.log(`[
            ${method} ${url} ${userAgent} ${userId}]`)
            
        const startTime = Date.now();
        
        //tap operator allows us to perform side effect
        return next.handle().pipe(
            tap({
                next : (data) =>{
                    const endTime = Date.now();
                    const duration  = endTime - startTime
                    
                    this.logger.log(`${method} ${url } ${duration}ms`)
                },
                error : (error)=>{
                    const endTime = Date.now();
                    const duration  = endTime - startTime

                    this.logger.log(`${url} ${error.message}`)
                }
            })
        ) 
    }
}