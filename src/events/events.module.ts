import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserEventService } from './user-event.service';
import { UserRegisteredListner } from './listeners/user-registered.listener';
import { UserLoginListner } from './listeners/user-loggedIn.listner';
import { UploadedFileListner } from './listeners/fileuploaded.listner';
import { FileEventService } from './file-event.service';
import { PostUploadListner } from './listeners/post-upload.listner';
import { PostEventService } from './post-event.service';

@Module({
    imports : [
        EventEmitterModule.forRoot({
            global : true,
            wildcard : false,
            maxListeners : 20,
            verboseMemoryLeak : true
        })
    ],
    providers : [
        UserEventService,
        UserRegisteredListner,
        UserLoginListner,
        FileEventService,
        UploadedFileListner,
        PostEventService,
        PostUploadListner,
    ],
    exports : [UserEventService,FileEventService]
})
export class EventsModule {}
