import { seeder } from "nestjs-seeder";
import { UserSeeder, PostSeeder, LikeSeeder } from "@database/seeders";
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFactory, LikeFactory, PostFactory } from '@database/factories';
import { dataSourceOptions } from '@config/database.config';

seeder({
  imports: [
  TypeOrmModule.forRoot({
        ...dataSourceOptions,
        entities: [__dirname + "/database/factories/*.factory.{ts,js}"]
    }),
    TypeOrmModule.forFeature([UserFactory, LikeFactory, PostFactory]),
  ],
}).run([UserSeeder, PostSeeder, LikeSeeder]);