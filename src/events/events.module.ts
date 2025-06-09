import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserEventService } from './user-event.service';
import { UserRegisteredListner } from './listeners/user-registered.listener';
import { UserLoginListner } from './listeners/user-loggedIn.listner';
import { UploadedFileListner } from './listeners/fileuploaded.listner';

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
        UploadedFileListner
    ],
    exports : [UserEventService]
})
export class EventsModule {}
