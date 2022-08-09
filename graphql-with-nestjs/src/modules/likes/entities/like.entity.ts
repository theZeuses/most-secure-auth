import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field, ID } from "@nestjs/graphql";

@Entity("likes")
@ObjectType({ description: 'like entity'})
export class LikeEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID, { description: 'model id of like'})
    id?: number

    @Column()
    @Field(() => Number, { description: 'id of post that this like belongs to'})
    post_id: Number

    @Column()
    @Field(() => String, { description: 'ip of the liker'})
    ip: string
}