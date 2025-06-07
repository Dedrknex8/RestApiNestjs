import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { emitUserRegisterEvent } from "../user-event.service";

//THIS WILL LISTEN TO THE EMITTER
@Injectable()
export class UserRegisteredListner{
    private readonly logger = new Logger(UserRegisteredListner.name);

    @OnEvent('User.registered')
    handleUserRegisteredEvent(event : emitUserRegisterEvent) : void{
        const {user , timeStamp} = event

        this.logger.log(`Welcome ${user.email} ! Your account created at ${timeStamp.toISOString()}`)
    }
}