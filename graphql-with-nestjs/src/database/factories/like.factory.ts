import { Factory } from "nestjs-seeder";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("likes")
export class LikeFactory {
    @PrimaryGeneratedColumn()
    id?: number

    @Factory(1)
    @Column()
    post_id: Number

    @Factory(faker => `${faker.internet.ip()}`)
    @Column()
    ip: string
}