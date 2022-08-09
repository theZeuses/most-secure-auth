import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from './entities';
import { CreateUserInput } from './dto';
import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import * as argon from "argon2";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>
    ){}

    async create(dto: CreateUserInput): Promise<UserEntity>{
        const fetched = await this.userRepository.findOneBy({username: dto.username});
        if(fetched) throw new UnprocessableEntityException({
            path: '/username',
            code: 'DUPLICATE'
        })
        const user = this.userRepository.create(dto);
        user.password = await argon.hash(user.password);
        return this.userRepository.save(user);
    }

    async findOneByUsername(username: string){
        return this.userRepository.findOneBy({ username });
    }

    async findOneById(model_id: number){
        return this.userRepository.findOneBy({ id: model_id });
    }
}