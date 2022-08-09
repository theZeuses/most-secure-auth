import { Info, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { PostEntity } from './entities';
import { PostService } from './post.service';
import { UseGuards } from "@nestjs/common";
import { JwtGuard } from "@modules/auth/guard";
import { SummaryType } from './types/summary.type';

@Resolver(() => PostEntity)
export class PostResolver {
    constructor(
        private readonly postService: PostService
    ){}

    @UseGuards(JwtGuard)
    @Query(() => [PostEntity], { name: 'posts' })
    async getPosts(){
        return this.postService.findAll();
    }

    @ResolveField('summary', returns => SummaryType)
    async getSummary(@Parent() post: PostEntity, @Info() info) {
      const { id } = post;
      let keys = info.fieldNodes[0].selectionSet.selections.map(item => item.name.value);
      return this.postService.getSummary(id.toString(), keys);
    }
}