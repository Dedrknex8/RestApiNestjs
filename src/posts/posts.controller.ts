import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import {Post as PostInterface}  from  '../interface/post.interface'
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
@Controller('posts')
export class PostsController {
    constructor(private readonly postService : PostsService ){}
        @Get()
        findAll(){
            return this.postService.findAll()
        }
        @Get(':id')
        findOne(@Param('id', ParseIntPipe)id : number): PostInterface{
            return this.postService.findSinglePost(id)
        }
        @Post()
        @HttpCode(HttpStatus.CREATED)
        create(@Body() createPostData : CreatePostDto) : PostInterface{
            return this.postService.createPost(createPostData)
        }

        @Put(':id')
        @HttpCode(200)
        update(@Param('id',ParseIntPipe)id:number,@Body() updatePostData: UpdatePostDto): PostInterface{
            return this.postService.updatePost(id,updatePostData)
        } //ParseIntPipe is used to convert string into integer

        @Delete(':id')
        @HttpCode(201)
        delePost(@Param('id',ParseIntPipe) id:number){
            return this.postService.deletePost(id)
        }

        
        
}
