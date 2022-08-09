import { Injectable } from "@nestjs/common";
import { UserFactory } from "@database/factories";
import { Seeder, DataFactory } from "nestjs-seeder";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import * as argon from "argon2";


@Injectable()
export class UserSeeder implements Seeder {
    constructor(@InjectRepository(UserFactory) private readonly userRepository: Repository<UserFactory>) {}

    async seed(): Promise<any> {
        const user = this.userRepository.create({
            username: 'guest',
            password: await argon.hash('guest'),
        });
        return this.userRepository.save(user);
    }

    async drop(): Promise<any> {
        return [];
    }
}