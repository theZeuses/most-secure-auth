import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserEntity } from './entities';
import { UserService } from './user.service';
import { CreateUserInput } from './dto';
import { UseGuards } from "@nestjs/common";
import { JwtGuard } from "@modules/auth/guard";

@Resolver(() => UserEntity)
export class UserResolver {
    constructor(
        private readonly userService: UserService
    ){}

    @UseGuards(JwtGuard)
    @Mutation(() => UserEntity)
    async createUser(@Args('input') createUserInput: CreateUserInput){
        return this.userService.create(createUserInput);
    }

    @Query(() => String)
    sayHello() {
      return 'Hello'
    }
}