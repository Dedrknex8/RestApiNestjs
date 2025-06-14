import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { File } from './cloudinary/entities/file.enitity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entity/user.entities';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { Role } from 'src/auth/entity/user.entities';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEventService } from 'src/events/user-event.service';
import { FileEventService } from 'src/events/file-event.service';
@Injectable()
export class FileuploadService {
    constructor(
        @InjectRepository(File) // Enject the enity here
        private readonly fileRepo: Repository<File>,
        private readonly CloudinaryService : CloudinaryService,
        private readonly fileEventService : FileEventService
    ){}


    async uploadFile(file : Express.Multer.File, description : string | undefined, user:User) : Promise<File>{
        const cloudinaryReponse = await this.CloudinaryService.uploadFile(file);

        const newnlyCreatedFile = this.fileRepo.create({
            originalName : file.originalname,
            mimeType : file.mimetype,
            size : file.size,
            publicId :  cloudinaryReponse?.public_id,
            url : cloudinaryReponse?.secure_url,
            description,
            uploader : user
        });

        this.fileEventService.emitUSerFileUpload(newnlyCreatedFile);
        return this.fileRepo.save(newnlyCreatedFile);
    }

    async findAll(user:User) : Promise<File[]>{
        if(user.role === Role.Admin){
         return this.fileRepo.find({
            relations : ['uploader'],
            order : {createdAt: 'DESC'}
        });
    }

    //FOR NORMAL USER   
     return this.fileRepo.find({
            relations : ['uploader'],
            order : {createdAt: 'DESC'}
        });
        
    
    }

    async findById(id:string,user:User) :  Promise<File>{
        const findFileById = await this.fileRepo.findOne({
            where : {id},
            relations : ['uploader'],
            
        })

        if(!findFileById){
            throw new NotFoundException("Either the file is missing or the id is not valid");
        }

        const isOwner = findFileById.uploader.id === user.id;
        const isAdmin = user.role === Role.Admin

        if(!isOwner && !isAdmin){
            throw new UnauthorizedException("You're not authorized to access this file" )
        }

        return findFileById;

    }
    

    async removeFile(id : string,user:User) : Promise<void>{
        const itemToBeDeleted = await this.fileRepo.findOne({
            where : {id},
            relations : ['uploader']
        });

        if(!itemToBeDeleted){
            throw new NotFoundException('File with this id cannot be found  ');
        }

        //first destoy from cloudinary service
        const isOwner = itemToBeDeleted.uploader.id === user.id;
        const isAdmin = user.role === Role.Admin;
        if(!isOwner && !isAdmin){
            throw new UnauthorizedException("User cannot be verified ...")
        }

        await this.CloudinaryService.deleteFile(itemToBeDeleted.publicId);

        await this.fileRepo.remove(itemToBeDeleted);
        
       

        
    }

    
} 
