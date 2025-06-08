import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import {  emitUserLoginEvent } from "../user-event.service";


@Injectable()
export class UserLoginListner {
    private readonly logger = new Logger(UserLoginListner.name);

    @OnEvent('user.login')
    handleUserLoginEvent(event : emitUserLoginEvent):void{
         const {user , timeStamp} = event

        this.logger.log(`Welcome ${user.email} ${user.role} ${user.name} ! Your account logged at ${timeStamp.toISOString()}`)
    }
    }
