import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field, ID } from "@nestjs/graphql";

@Entity("users")
@ObjectType({ description: 'user entity'})
export class UserEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID, { description: 'model id of user'})
    id?: number

    @Column()
    @Field(() => String, { description: 'username of user'})
    username: string

    @Column()
    @Field(() => String, { description: 'password of user'})
    password: string
}