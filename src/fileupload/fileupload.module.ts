import { Module } from '@nestjs/common';
import { FileuploadController } from './fileupload.controller';
import { FileuploadService } from './fileupload.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './cloudinary/entities/file.enitity';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports : [
    TypeOrmModule.forFeature([File]),
    CloudinaryModule,
    MulterModule.register({
      storage : memoryStorage()
    }),
    EventsModule
  ],
  controllers: [FileuploadController],
  providers: [FileuploadService,]
})
export class FileuploadModule {}
