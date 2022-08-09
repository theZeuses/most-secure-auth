import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("posts")
export class PostFactory {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    text: string   
}