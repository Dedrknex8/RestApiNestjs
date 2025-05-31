import { Injectable } from '@nestjs/common';
import { File } from './cloudinary/entities/file.enitity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entity/user.entities';
import { CloudinaryService } from './cloudinary/cloudinary.service';

@Injectable()
export class FileuploadService {
    constructor(
        @InjectRepository(File) // Enject the enity here
        private readonly fileRepo: Repository<File>,
        private readonly CloudinaryService : CloudinaryService
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

        return this.fileRepo.save(newnlyCreatedFile);
    }

    async findAll() : Promise<File[]>{
        return this.fileRepo.find({
            relations : ['uploader'],
            order : {createdAt: 'DESC'}
        })
    }
} 
