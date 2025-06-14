import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { on } from "events";
import { NextFunction, Request, Response } from "express";


@Injectable()
export class LoginMidleware implements NestMiddleware{
    private readonly logger = new Logger('HTTP');
    use(req:Request, res: Response, next: NextFunction):void {
        const {method , originalUrl, ip } = req;

        this.logger.log(`this is ${originalUrl} ${method} ${ip}`);
    
        req['start-Time'] = Date.now()
        
        res.on('finish',()=>{
            const duration = Date.now() - req['start-Time'];

            const {statusCode} = res;

            if(statusCode >= 500){
                this.logger.error(`[Response] -> ${method} -  ${duration} ${ip}  - ${statusCode}`)
            }else if(statusCode >= 400){
                 this.logger.warn(`[Response] -> ${method} -  ${duration} ${ip}  - ${statusCode}`)
            }else {
                this.logger.log(`[Response] -> ${method} -  ${duration} ${ip}  - ${statusCode}`)
            }
        })
        next(); //THIS IS COMMAND TO MAKE SURE THE NEXT COMMAND IS AVALABLE FOR IT PASS TO NEXT
    }
}