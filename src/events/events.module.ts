import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserEventService } from './user-event.service';
import { UserRegisteredListner } from './listeners/user-registered.listener';

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
        UserRegisteredListner
    ],
    exports : [UserEventService]
})
export class EventsModule {}
