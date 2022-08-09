import { IsNotEmpty, IsOptional } from "@nestjs/class-validator";
import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class UserInput {
    @Field(() => ID, { description: 'model id of user'})
    @IsOptional()
    id?: number
    
    @Field(() => String, { description: 'username of user'})
    @IsNotEmpty()
    username: string

    @Field(() => String, { description: 'password of user'})
    @IsNotEmpty()
    password: string
}