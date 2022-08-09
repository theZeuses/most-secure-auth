import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SummaryType {
    @Field(() => Number)
    likes_count?: number
}