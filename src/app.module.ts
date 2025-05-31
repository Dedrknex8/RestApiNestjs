import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import {TypeOrmModule} from '@nestjs/typeorm'
import { Post } from './posts/entities/post.entity';
import {ConfigModule,ConfigService} from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entity/user.entities';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { FileuploadModule } from './fileupload/fileupload.module';
import { File } from './fileupload/cloudinary/entities/file.enitity';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal : true
  }),
  ThrottlerModule.forRoot([
    {
       ttl : 6000, //in milliSecond
       limit : 1, // 10 means 10 limit per user
    }
  ]),
    CacheModule.register({
      isGlobal : true,
      ttl : 3000,
      max : 100
    }),
    TypeOrmModule.forRoot({
      type : 'postgres',
      host : 'localhost',
      port : 5432 ,
      username : 'postgres',
      password : 'root',
      database : 'NestJsTest',
      //entity means model
      entities : [Post,User,File], //make sure to import/delcare all entities here
      synchronize : true // disable in production mode it creates data everytime app launches

    }),
    PostsModule,
    AuthModule,
    FileuploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
