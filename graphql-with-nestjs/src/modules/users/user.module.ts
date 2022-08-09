import { Module } from "@nestjs/common";
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities';

@Module({
    imports:[TypeOrmModule.forFeature([UserEntity])],
    providers:[UserResolver, UserService],
    exports:[UserService]
})

export class UserModule{}