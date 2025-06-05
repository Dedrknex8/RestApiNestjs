import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileuploadService } from './fileupload.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadFileDto } from './DTO/FileUplaod.dto';
import { getCurrentUser } from 'src/auth/Decorators/user.decorator';
import { User } from 'src/auth/entity/user.entities';

@Controller('fileupload')
export class FileuploadController {
    constructor(private readonly fileUploadService: FileuploadService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile()  file :   Express.Multer.File,
        @Body() fileUploadDto : uploadFileDto,
        @getCurrentUser() user : User,
    ): Promise<any>{
        if(!file){
            throw new BadRequestException('File not present please provide file');
        }

        return this.fileUploadService.uploadFile(file,fileUploadDto.description,user);
    }

    @Get()
    @UseGuards(JwtAuthGuard)

    async findAll(): Promise<any>{
        return this.fileUploadService.findAll()
    }
    
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findByID(@Param('id') id:string, @getCurrentUser() user:User) : Promise<any>{
        return this.fileUploadService.findById(id,user);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteFile(
        @Param('id') id:string,
        @getCurrentUser() user : User
    ) : Promise<{message : string}>{
         const fileToBeDeleted = await this.fileUploadService.removeFile(id);

          return {message : 'File deleted successfully'}
        
    }
}
