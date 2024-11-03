import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Tournament } from 'src/database/schemas/tournament.schema';
import { GamesService } from 'src/games/games.service';
import { IFilterGameDto } from 'src/interfaces/game';
import {
    ICreateTournamentDto,
    IFilterTournamentDto,
    IUpdateTournamentDto,
} from 'src/interfaces/tournament';

@Injectable()
export class TournamentsService {
    constructor(
        @InjectModel(Tournament.name)
        private tournamentModel: Model<Tournament>,
        private gameService: GamesService,
    ) {}

    async findById(id: string): Promise<Tournament> {
        return await this.tournamentModel.findById(id).exec();
    }

    async findByName(name: string): Promise<Tournament> {
        return await this.tournamentModel
            .findOne({
                name: name,
            })
            .exec();
    }

    async findAll(): Promise<Tournament[]> {
        return await this.tournamentModel.find().exec();
    }

    async create(createDto: ICreateTournamentDto): Promise<Tournament> {
        if (await this.tournamentModel.findOne({ name: createDto.name.toLocaleLowerCase() }).exec())
            throw new ConflictException('The tournament already exists');

        const newTournament = new this.tournamentModel({
            name: createDto.name,
        });

        return await newTournament.save();
    }

    async update(updateDto: IUpdateTournamentDto): Promise<Tournament> {
        return await this.tournamentModel
            .findOneAndUpdate({ name: updateDto.filter.name }, updateDto)
            .exec();
    }

    async delete(filterDto: IFilterTournamentDto): Promise<Tournament> {
        const tournament = await this.tournamentModel
            .findOneAndDelete({ name: filterDto.name })
            .exec();

        const games = await this.gameService.findAll(tournament._id.toString());

        for (const game of games) {
            const filter: IFilterGameDto = {
                player_id: game.player_id.toString(),
                tournament_id: game.tournament_id.toString(),
            };

            await this.gameService.delete(filter);
        }

        return tournament;
    }
}
