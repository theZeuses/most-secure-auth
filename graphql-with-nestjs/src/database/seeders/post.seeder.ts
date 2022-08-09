import { Injectable } from "@nestjs/common";
import { PostFactory } from "@database/factories";
import { Seeder, DataFactory } from "nestjs-seeder";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';

@Injectable()
export class PostSeeder implements Seeder {
    constructor(@InjectRepository(PostFactory) private readonly postRepository: Repository<PostFactory>) {}

    async seed(): Promise<any> {
        const post = this.postRepository.create({
            text: 
                `<strong>Postgres EXPLAIN ANALYZE</strong>
                <br />
                <br />
                <span>
                    <strong>EXPLAIN</strong> command displays the execution plan with the estimated execution cost that the PostgreSQL planner generates for the supplied statement.
                    The <strong>ANALYZE</strong> option causes the statement to be actually executed, not only planned. Then actual run time statistics are added to the display, including the total elapsed time expended within each plan node (in milliseconds) and the total number of rows it actually returned.
                    So using EXPLAIN and ANALYZE alongside we can test the efficiency of our query.
                </span>`,
        });
        return this.postRepository.save(post);
    }

    async drop(): Promise<any> {
        return [];
    }
}