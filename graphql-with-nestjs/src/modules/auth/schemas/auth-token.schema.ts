import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class AuthSchema {
    @Field(() => String)
    bearer_token: string

    @Field(() => String)
    refresh_token: string

    @Field(() => Number)
    expires_in: number
}