import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { User } from "src/auth/entity/user.entities";
import { Post } from "src/posts/entities/post.entity";

export interface emitPostInterface{
    post : {
        id: number,
        title : string,
        authorname : User,
    }
     timestamp :  Date;
}

@Injectable()
export class PostEventService{

    constructor (
        private readonly eventEmitter : EventEmitter2
    ){}

    //EMIT EVENT FOR FILE UPLAOD
            emitUSerPost(post:Post):void{
                const postUplaod : emitPostInterface = {
                    post : {
                        id : post.id,
                        title : post.title,
                        authorname : post.authorname

                    },
                    timestamp : new Date()
        
                }
                this.eventEmitter.emit('post.uploaded',postUplaod);
            }
}