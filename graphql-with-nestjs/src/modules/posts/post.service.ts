import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { PostEntity } from './entities';
import { Injectable } from "@nestjs/common";

@Injectable()
export class PostService {
    constructor(
        @InjectDataSource() 
        private readonly dataSource: DataSource,
        @InjectRepository(PostEntity) 
        private readonly postRepository: Repository<PostEntity>
    ){}

    async findAll(findOption = undefined){
        return this.postRepository.find(findOption);
    }
    async findOneById(model_id: number){
        return this.postRepository.findOneBy({ id: model_id });
    }
    async getSummary(post_id: string, fields: string[]){
        const summary: {
            likes_count?: number
        } = {};
        const promises = fields.map(async (field) => {
            if(field == 'likes_count'){
                const result = await this.dataSource.query('explain (format json) select id from "likes" where post_id=$1', [post_id]);
                summary.likes_count = result[0]['QUERY PLAN'][0].Plan['Plan Rows'];
            }
        });
        await Promise.all(promises);
        return summary;
    }
}