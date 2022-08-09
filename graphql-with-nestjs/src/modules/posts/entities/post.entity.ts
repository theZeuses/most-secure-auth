import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field, ID } from "@nestjs/graphql";
import { SummaryType } from '../types';

@Entity("posts")
@ObjectType({ description: 'post entity'})
export class PostEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID, { description: 'model id of post'})
    id?: number

    @Column()
    @Field(() => String, { description: 'text content of post'})
    text: string

    @Field(() => SummaryType)
    summary?: SummaryType    
}