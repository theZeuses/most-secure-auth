import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateUserInput {
    @Field(() => String, { description: 'username of user'})
    username: string

    @Field(() => String, { description: 'password of user'})
    password: string
}