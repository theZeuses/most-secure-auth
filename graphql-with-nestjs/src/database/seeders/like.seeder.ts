import { Injectable } from "@nestjs/common";
import { LikeFactory } from "@database/factories";
import { Seeder, DataFactory } from "nestjs-seeder";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import * as argon from "argon2";


@Injectable()
export class LikeSeeder implements Seeder {
    constructor(@InjectRepository(LikeFactory) private readonly likeRepository: Repository<LikeFactory>) {}

    async seed(): Promise<any> {
        const likes = DataFactory.createForClass(LikeFactory).generate(200000);
        return this.likeRepository.save(likes, { chunk: likes.length / 1000});
    }

    async drop(): Promise<any> {
        return [];
    }
}