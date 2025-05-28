import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { single } from 'rxjs';
import { error, log } from 'console';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/createPost.dto';
import { title } from 'process';
import { UpdatePostDto } from './dto/updatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from 'src/auth/entity/user.entities';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { FindPageQueryDTO } from 'src/common/dto/findpageQurery.dto';
import { PaginationReponse } from 'src/common/interfaces/pagination-response.interface';
import { Cache } from 'cache-manager';
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
    
    private postListCacheKeys : Set<string> =  new Set(); //THIS WILL KEEP TRACK OF CHACHE KEYS
    constructor(
        @InjectRepository(Post)
        private postRespository : Repository<Post>,
        @Inject(CACHE_MANAGER) private cacheManager : Cache,
    ){}

    private generatePostListCacheKey(query  :FindPageQueryDTO) : string {
        const {page =1, limit = 10, title} = query
        return `post_list_page${page}_limit${limit}_title${title || 'all'}`
    }   
    async findAll(query : FindPageQueryDTO) : Promise<PaginationReponse<Post>>{
        // return this.postRespository.find({
        //     relations : ['authorname']
        
      const cacheKey = await this.generatePostListCacheKey(query)  
    
      this.postListCacheKeys.add(cacheKey)

      const getCachedata = await this.cacheManager.get<PaginationReponse<Post>>(cacheKey)

      if(getCachedata){
        console.log(`cache found ---> ${getCachedata}`)
      }else{
        console.log(`cache missed ----> no cache found`)
      }

      //ADD FILTERS FOR CACHING

      const {page = 1, limit = 10, title} = query;

      const skip = page - 1 * limit;
  
      const queryBuilder = this.postRespository.createQueryBuilder('post').leftJoinAndSelect('post.authorname','authorname').orderBy('post.createdAt','DESC').skip(skip).take(limit);

      if(title){
        queryBuilder.andWhere('post.title ILIKE : title', {title : `${title}%` })
      }

      const [items,totalItems] = await queryBuilder.getManyAndCount();

      const totalPages = Math.ceil(totalItems/limit)

      const reponseResult = {
        items,
        meta : {
            currentPage : page,
            itemsPerpage : limit,
            totalItems : totalItems,
            totalPages : totalPages,
            hashPrevPage  : page >1,
            hashNextPage  : page <totalPages
        }
      }

      await this.cacheManager.set(cacheKey, reponseResult,3000);
      return reponseResult;


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
