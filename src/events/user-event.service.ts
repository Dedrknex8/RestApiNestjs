import { Injectable } from "@nestjs/common";
import { User } from "src/auth/entity/user.entities";
import { EventEmitter } from "stream";

export interface emitUserRegisterEvent{
    user:{
        id :number,
        email : string,
        name :string
    },
    timeStamp : Date
}

Injectable()
export class UserEventService{
    constructor(
        private readonly eventEmiiter : EventEmitter
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

        //EVENT NAME && DATA    
        this.eventEmiiter.emit('user.registered', UserRegisteredData)
    }

}