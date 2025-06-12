import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";


@Injectable()
export class LoginMidleware implements NestMiddleware{
    private readonly logger = new Logger('HTTP')
    use(req:Request, res: Response, next: NextFunction):void {
        const {method , originalUrl, ip } = req;

        this.logger.log(`this is ${originalUrl} ${method}`);
    }
}