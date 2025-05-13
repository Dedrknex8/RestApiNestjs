import { Injectable, NotFoundException } from '@nestjs/common';
import {Post} from '../interface/post.interface'
import { single } from 'rxjs';
import { error } from 'console';
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

    createPost(createPostData : Omit<Post, 'id' | 'createdAt'>) : Post{
        const newPost : Post = {
            id: this.getNextId(),
            ...createPostData,
            createdAt : new Date()

        };
        this.posts.push(newPost)
        return newPost

    }
    private getNextId():number{
        return this.posts.length >0 ? 
        Math.max(...this.posts.map(post => post.id)) +1 : 1;
    }

    updatePost(id: number, updatePostData : Partial<Omit<Post,'id' | 'createdAt'>> ) : Post{
        const currentPostIdx = this.posts.findIndex(post => post.id === id);

        if(currentPostIdx === -1){
            throw new NotFoundException('Cannt find any post with this id');

        }
        this.posts[currentPostIdx] = {
            ...this.posts[currentPostIdx],
            ...updatePostData,
            updatedAt : new Date()
        }

        return this.posts[currentPostIdx]
    }

    deletePost(id:number):{message : string, deletedpost: Post}{
        const itemToBeDeleted = this.posts.findIndex(post=> post.id === id)

        if(itemToBeDeleted === -1){
            throw new NotFoundException('Post cannt be found with this id')

        }

        const [deletedpost] = this.posts.splice(itemToBeDeleted,1);
        return {
            message : 'Post deleted successfully',
            deletedpost
        };
    }
}
