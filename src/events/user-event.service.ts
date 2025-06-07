import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { User } from "src/auth/entity/user.entities";

export interface emitUserRegisterEvent{
    user:{
        id :number,
        email : string,
        name :string
    },
    timeStamp : Date
}

@Injectable()
export class UserEventService{
    constructor(
        private readonly eventEmitter : EventEmitter2
    ){}
    

    //emit an user register event\
    emitUserRegistered(user :User): void{
        const UserRegisteredData : emitUserRegisterEvent = {
            user : {
                id : user.id,
                email : user.email,
                name : user.username
            },
            timeStamp : new Date()
        }

        // EVENT NAME && DATA    
        this.eventEmitter.emit('user.registered', UserRegisteredData);
    }

}