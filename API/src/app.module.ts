import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { GamesModule } from './games/games.module';
import { PlayersModule } from './players/players.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        AuthModule, 
        ConfigModule.forRoot({ isGlobal: true }),
        GamesModule,
        MongooseModule.forRoot(process.env.MONGODB_URI),
        PlayersModule,
        TournamentsModule,
        UsersModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}