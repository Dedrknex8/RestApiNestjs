import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('v1')
export class PostsController {
    constructor(private readonly postService : PostsService){}
        @Get()
        findAll(){
            return this.postService.findAll()
        }

        
        
}
