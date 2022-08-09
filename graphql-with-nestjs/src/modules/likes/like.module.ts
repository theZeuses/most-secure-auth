import { Module } from "@nestjs/common";
import { LikeResolver } from './like.resolver';
import { LikeService } from './like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeEntity } from './entities';

@Module({
    imports:[TypeOrmModule.forFeature([LikeEntity])],
    providers:[LikeResolver, LikeService],
    exports:[LikeService]
})

export class LikeModule{}