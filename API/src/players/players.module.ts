import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Player, PlayerSchema } from 'src/database/schemas/player.schema';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Player.name,
                schema: PlayerSchema,
            },
        ]),
    ],
    controllers: [PlayersController],
    providers: [PlayersService],
})
export class PlayersModule {}
