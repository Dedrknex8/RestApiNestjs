import { Injectable } from '@nestjs/common';
import {Post} from '../interface/post.interface'
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
}
