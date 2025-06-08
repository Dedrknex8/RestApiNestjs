import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { stringify } from "querystring";
import { User } from "src/auth/entity/user.entities";

export interface emitUserRegisterEvent{
    user:{
        id :number,
        email : string,
        name :string
    },
    timeStamp : Date
}
export interface emitUserLoginEvent{
    user:{
        id :number,
        email : string,
        name :string,
        role : string
    },
    timeStamp : Date
}

// export interface emitUserFileUpload{
//     file : {
//         uuid : string,
//         uploader : string
//     }
// }
@Injectable()
export class UserEventService{
    constructor(
        private readonly eventEmitter : EventEmitter2
    ){}
    //EMIT LOGIN USER EVENT
    emitUserLogin(user:User):void{
        const userLogedIn : emitUserLoginEvent ={
            user : {
                id : user.id,
                email : user.email,
                name : user.username,
                role : user.role
            },
            timeStamp : new Date()
        }
        this.eventEmitter.emit('user.login', userLogedIn);
    }

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