import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import {Post as PostInterface}  from  '../interface/post.interface'
@Controller('posts')
export class PostsController {
    constructor(private readonly postService : PostsService ){}
        @Get()
        findAll(){
            return this.postService.findAll()
        }
        @Get(':id')
        findOne(@Param('id', ParseIntPipe)id : Number): PostInterface{
            return this.postService.findSinglePost(id)
        }
        @Post()
        @HttpCode(HttpStatus.CREATED)
        create(@Body() createPostData : Omit<PostInterface,'id' | 'createdAt'>) : PostInterface{
            return this.postService.createPost(createPostData)
        }



        
        
}
