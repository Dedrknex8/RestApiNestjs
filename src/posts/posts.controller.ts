import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import {Post as PostInterface}  from  '../interface/post.interface'
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { Post as PostEntity} from './entities/post.entity';
import { getCurrentUser } from 'src/auth/Decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { Role, User } from 'src/auth/entity/user.entities';
import { Roles } from 'src/auth/Decorators/roles.decorators';
import { RolesGuards } from 'src/auth/guards/role.guard';
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

        @UseGuards(JwtAuthGuard)
        @Post()
        @HttpCode(HttpStatus.CREATED)
        async create(@Body() createPostData : CreatePostDto, @getCurrentUser() user:any) : Promise<PostEntity>{
            return this.postService.createPost(createPostData,user)
        }

        @Put(':id')
        @HttpCode(200)
        async update(
            @Param('id',ParseIntPipe)id:number,
            @Body() updatePostData: UpdatePostDto,
            @getCurrentUser('id') userId : number,
            @getCurrentUser('role') userrole: Role,
        ): Promise<PostEntity>{
            return this.postService.updatePost(id,updatePostData,userId,userrole);
        } //ParseIntPipe is used to convert string into integer
        @Roles(Role.Admin)
        @UseGuards(JwtAuthGuard,RolesGuards)
        @Delete(':id')
        @HttpCode(201)
        async delePost(@Param('id',ParseIntPipe) id:number) {
            return this.postService.deletePost(id)
        }

        
        
}
