import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Tournament, TournamentSchema } from 'src/database/schemas/tournament.schema';
import { TournamentsController } from './tournaments.controller';
import { TournamentsService } from './tournaments.service';
import { GamesModule } from 'src/games/games.module';

@Module({
  imports: [
    MongooseModule.forFeature([
        {
            name: Tournament.name,
            schema: TournamentSchema,
        },
    ]),
    GamesModule
],
  controllers: [TournamentsController],
  providers: [TournamentsService]
})
export class TournamentsModule {}
