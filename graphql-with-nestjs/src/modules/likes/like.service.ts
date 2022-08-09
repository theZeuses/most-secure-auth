import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LikeEntity } from './entities';
import { Injectable } from "@nestjs/common";
import { CreateLikeInput } from "./dto";

@Injectable()
export class LikeService {
    constructor(
        @InjectRepository(LikeEntity) 
        private readonly likeRepository: Repository<LikeEntity>
    ){}

    async findAll(findOption = undefined){
        return this.likeRepository.find(findOption);
    }
    async findOneById(model_id: number){
        return this.likeRepository.findOneBy({ id: model_id });
    }
    async createOne(dto: CreateLikeInput){
        const like = this.likeRepository.create(dto);
        return this.likeRepository.save(like);
    }
}