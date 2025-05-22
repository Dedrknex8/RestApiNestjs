import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { single } from 'rxjs';
import { error } from 'console';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { title } from 'process';
import { UpdatePostDto } from './dto/updatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from 'src/auth/entity/user.entities';
@Injectable()
export class PostsService {
    // private posts : Post[]= [
    //     {
    //         id : 1,
    //         title : "new title",
    //         content:"new content",
    //         authorname : "Rain ",
    //         createdAt: new Date(),
    //     }
    // ];
    constructor(
        @InjectRepository(Post)
        private postRespository : Repository<Post>
    ){}

    async findAll() : Promise<Post[]>{
        return this.postRespository.find({
            relations : ['authorname']
        });
    }
    async findSinglePost(id:number) : Promise<Post>{
        const singlePost = await  this.postRespository.findOne({
            where : {id},
            relations : ['authorname'] //added realtion b\w psot and author
        })
        if(!singlePost){
            throw new NotFoundException(`Post with this ${id} is not found`);
        }
        return singlePost;
    };

    async createPost(createPostData : CreatePostDto, authorname : User) : Promise<Post>{
        const newPost  = await this.postRespository.create({
            title : createPostData.title,
            content : createPostData.content,
            authorname, //make raltion to user enitty
        })
        return this.postRespository.save(newPost);


    }
    
    async updatePost(id: number, updatePostData : UpdatePostDto,userId :number,userRole: Role ) :Promise<Post>{
        const currentPost  = await this.postRespository.findOne({
            where : {id},
            relations : ['authorname']
        })

        if(!currentPost){  
            throw new ForbiddenException("You're not allowed to edit this post");
        }

        const isOwner = currentPost.authorname.id === userId;

        const isAdmin = userRole == Role.Admin; // it's make sure that you're an admin user
        
        if(!isOwner && !isAdmin){
            throw new ForbiddenException('Invalid Permission');
        }

        Object.assign(currentPost,updatePostData)

        return this.postRespository.save(currentPost);
        
    }

    async deletePost(id:number):Promise<{message : string}>{
        const itemToBeDeleted  = await this.findSinglePost(id)

        await this.postRespository.remove(itemToBeDeleted);
        
        return {message : `Post deleted with ${id} successfully`}
    }
}
