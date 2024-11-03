import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Game } from 'src/database/schemas/game.schema';
import {
    ICreateGameDto,
    IFilterGameDto,
    IUpdateGameDto,
} from 'src/interfaces/game';

@Injectable()
export class GamesService {
    constructor(
        @InjectModel(Game.name)
        private gameModel: Model<Game>,
    ) {}

    async findByPlayerIdAndTournamentId(
        playerId: string,
        tournamentId: string,
    ): Promise<Game> {
        return await this.gameModel
            .findOne({
                player_id: new Types.ObjectId(playerId),
                tournament_id: new Types.ObjectId(tournamentId),
            })
            .exec();
    }

    async findAll(tournamentId: string): Promise<Game[]> {
        return await this.gameModel
            .find({ tournament_id: new Types.ObjectId(tournamentId) })
            .exec();
    }

    async create(createDto: ICreateGameDto): Promise<Game> {
        if (
            await this.gameModel
                .findOne({
                    player_id: new Types.ObjectId(createDto.player_id),
                    tournament_id: new Types.ObjectId(createDto.tournament_id),
                })
                .exec()
        )
            throw new ConflictException(
                'The player has already participated in the tournament',
            );

        const newGame = new this.gameModel({
            player_id: new Types.ObjectId(createDto.player_id),
            tournament_id: new Types.ObjectId(createDto.tournament_id),
            handicap: createDto.handicap,
            game1: createDto.game1,
            game2: createDto.game2,
            game3: createDto.game3,
            game4: createDto.game4,
            game5: createDto.game5,
            game6: createDto.game6,
        });

        return await newGame.save();
    }

    async update(updateDto: IUpdateGameDto): Promise<Game> {
        const playerId = new Types.ObjectId(updateDto.filter.player_id);
        const tournamentId = new Types.ObjectId(updateDto.filter.tournament_id);

        return await this.gameModel
            .findOneAndUpdate(
                {
                    player_id: playerId,
                    tournament_id: tournamentId,
                },
                updateDto,
            )
            .exec();
    }

    async delete(filterDto: IFilterGameDto): Promise<Game> {
        return await this.gameModel
            .findOneAndDelete({
                player_id: new Types.ObjectId(filterDto.player_id),
                tournament_id: new Types.ObjectId(filterDto.tournament_id),
            })
            .exec();
    }
}
