import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { single } from 'rxjs';
import { error } from 'console';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { title } from 'process';
import { UpdatePostDto } from './dto/updatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';
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
        return this.postRespository.find();
    }
    async findSinglePost(id:number) : Promise<Post>{
        const singlePost = await  this.postRespository.findOneBy({id})
        if(!singlePost){
            throw new NotFoundException(`Post with this ${id} is not found`);
        }
        return singlePost;
    };

    async createPost(createPostData : CreatePostDto) : Promise<Post>{
        const newPost  = await this.postRespository.create({
            title : createPostData.title,
            content : createPostData.content,
            authorname : createPostData.authorname,
        })
        return this.postRespository.save(newPost);


    }
    
    async updatePost(id: number, updatePostData : UpdatePostDto ) :Promise<Post>{
        const currentPostIdx = await this.findSinglePost(id)

        Object.assign(currentPostIdx,updatePostData)

        return this.postRespository.save(currentPostIdx);
        
    }

    async deletePost(id:number):Promise<{message : string}>{
        const itemToBeDeleted  = await this.findSinglePost(id)

        await this.postRespository.remove(itemToBeDeleted);
        
        return {message : `Post deleted with ${id} successfully`}
    }
}
