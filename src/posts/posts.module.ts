import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { AuthModule } from 'src/auth/auth.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports : [
    TypeOrmModule.forFeature([Post]),
    AuthModule,
    EventsModule
  ],
  providers: [PostsService],
  controllers: [PostsController]
})
export class PostsModule {}
