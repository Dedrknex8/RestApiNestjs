import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import {Post as PostInterface}  from  '../interface/post.interface'
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { Post as PostEntity} from './entities/post.entity';
@Controller('posts')
export class PostsController {
    constructor(private readonly postService : PostsService ){}
        @Get()
        async findAll() : Promise<PostEntity[]>{
            return this.postService.findAll()
        }
        @Get(':id')
        async findOne(@Param('id', ParseIntPipe)id : number): Promise<PostEntity>{
            return this.postService.findSinglePost(id)
        }
        @Post()
        @HttpCode(HttpStatus.CREATED)
        async create(@Body() createPostData : CreatePostDto) : Promise<PostEntity>{
            return this.postService.createPost(createPostData)
        }

        @Put(':id')
        @HttpCode(200)
        async update(@Param('id',ParseIntPipe)id:number,@Body() updatePostData: UpdatePostDto): Promise<PostEntity>{
            return this.postService.updatePost(id,updatePostData)
        } //ParseIntPipe is used to convert string into integer

        @Delete(':id')
        @HttpCode(201)
        async delePost(@Param('id',ParseIntPipe) id:number) {
            return this.postService.deletePost(id)
        }

        
        
}
