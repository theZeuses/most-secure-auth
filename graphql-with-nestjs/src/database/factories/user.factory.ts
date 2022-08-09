import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class UserFactory {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    username: string

    @Column()
    password: string
}