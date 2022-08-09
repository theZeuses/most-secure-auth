import { Module } from "@nestjs/common";
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities';

@Module({
    imports:[TypeOrmModule.forFeature([PostEntity])],
    providers:[PostResolver, PostService],
    exports:[PostService]
})

export class PostModule{}