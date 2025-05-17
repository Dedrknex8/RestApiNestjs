import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import {TypeOrmModule} from '@nestjs/typeorm'
import { Post } from './posts/entities/post.entity';
import {ConfigModule,ConfigService} from '@nestjs/config'
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal : true
  }),
    TypeOrmModule.forRoot({
      type : 'postgres',
      host : 'localhost',
      port : 5432 ,
      username : 'postgres',
      password : 'root',
      database : 'NestJsTest',
      //entity means model
      entities : [Post],
      synchronize : true // disable in production mode it creates data everytime app launches

    }),
    PostsModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
