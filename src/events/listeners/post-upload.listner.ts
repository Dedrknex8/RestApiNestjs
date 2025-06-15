import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import {  emitUserLoginEvent } from "../user-event.service";
import { emitPostInterface } from "../post-event.service";


@Injectable()
export class PostUploadListner {
    private readonly logger = new Logger(PostUploadListner.name);

    @OnEvent('post.uploaded')
    handleUserLoginEvent(event : emitPostInterface ):void{
         const {post , timestamp} = event

        this.logger.log(`[REQUEST] POST  with ${post.id} of user-> ${post.authorname} created successfully at ${timestamp.toISOString()}`)
    }
    }
