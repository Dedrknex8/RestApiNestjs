import { Injectable, NotFoundException } from '@nestjs/common';
import {Post} from '../interface/post.interface'
import { single } from 'rxjs';
@Injectable()
export class PostsService {
    private posts : Post[]= [
        {
            id : 1,
            title : "new title",
            content:"new content",
            authorname : "Rain ",
            createdAt: new Date(),
        }
    ];

    findAll() : Post[]{
        return this.posts
    }
    findSinglePost(id:Number) : Post{
        const singlePost = this.posts.find(post=> post.id === id)
        if(!singlePost){
            throw new NotFoundException(`Post with this ${id} is not found`);
        }
        return singlePost
    }
}
