import { IsNotEmpty } from "@nestjs/class-validator";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class AuthInput {
    @Field(() => String, { description: 'username of user'})
    @IsNotEmpty()
    username: string

    @Field(() => String, { description: 'password of user'})
    @IsNotEmpty()
    password: string
}