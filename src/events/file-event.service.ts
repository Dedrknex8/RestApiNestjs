import { EventEmitter2 } from "@nestjs/event-emitter"
import { File } from "src/fileupload/cloudinary/entities/file.enitity";

export interface emitFileUploadEvent{
    file : {
        id : string,
        originalName : string,
        mimeType : string,
        url : string,
    },
    timestamp :  Date
}

export class FileEventService {
    constructor (
        private readonly eventEmitter : EventEmitter2 
    ){}

    //EMIT EVENT FOR FILE UPLAOD
        emitUSerFileUpload(file:File):void{
            const uploadedFile : emitFileUploadEvent = {
                file : {
                    id : file.id,
                    originalName: file.originalName,
                    mimeType : file.mimeType,
                    url : file.url,
                },
                timestamp : new Date()
    
            }
            this.eventEmitter.emit('file.uploaded',uploadedFile);
        }
}