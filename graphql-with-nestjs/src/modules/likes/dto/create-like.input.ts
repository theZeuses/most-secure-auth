import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateLikeInput {
    @Field(() => Number, { description: 'id of post that this like belongs to'})
    post_id: string

    @Field(() => String, { description: 'ip of the liker'})
    ip: string
}