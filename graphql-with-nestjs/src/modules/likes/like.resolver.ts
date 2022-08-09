import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { LikeEntity } from './entities';
import { LikeService } from './like.service';
import { UseGuards } from "@nestjs/common";
import { JwtGuard } from "@modules/auth/guard";
import { CreateLikeInput } from "./dto";

@Resolver(() => LikeEntity)
export class LikeResolver {
    constructor(
        private readonly likeService: LikeService
    ){}

    @UseGuards(JwtGuard)
    @Query(() => [LikeEntity], {name: 'likes'})
    async GetLikes(){
        return this.likeService.findAll();
    }

    @UseGuards(JwtGuard)
    @Mutation(() => LikeEntity)
    async createLike(@Args('input') createLikeInput: CreateLikeInput){
        return this.likeService.createOne(createLikeInput);
    }
}