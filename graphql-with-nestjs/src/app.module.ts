import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UserModule } from './modules/users/user.module';
import { PostgresDatabaseProviderModule } from '@providers/database/postgres/provider.module';
import { AuthModule } from '@modules/auth/auth.module';
import { LikeModule } from './modules/likes/like.module';
import { PostModule } from './modules/posts/post.module';
import { RedisProviderModule } from '@providers/memory-store/memory-store.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      cors: { origin: true, credentials: true }
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PostgresDatabaseProviderModule,
    RedisProviderModule,
    UserModule,
    AuthModule,
    PostModule,
    LikeModule
  ]
})
export class AppModule {}
