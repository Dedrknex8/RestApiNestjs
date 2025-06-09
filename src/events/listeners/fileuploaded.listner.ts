import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { emitFileUploadEvent } from "../user-event.service";


@Injectable()

export class UploadedFileListner {
    private readonly logger = new Logger(UploadedFileListner.name);

    @OnEvent('file.uploaded')
    handleFileUpload(event : emitFileUploadEvent):void{
        const {file,timestamp} = event;

        const {originalName,url,mimeType} = file

        this.logger.log(`File ${originalName} uplaoded successfully of type ${mimeType} at ${timestamp.toISOString()} url  : ${url}  `)
    }

}