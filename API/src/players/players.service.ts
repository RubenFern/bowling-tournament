import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Player } from 'src/database/schemas/player.schema';
import {
    ICreatePlayerDto,
    IFilterPlayerDto,
    IUpdatePlayerDto,
} from 'src/interfaces/player';

@Injectable()
export class PlayersService {
    constructor(
        @InjectModel(Player.name)
        private playerModel: Model<Player>,
    ) {}

    async findById(id: string): Promise<Player> {
        return await this.playerModel.findById(id).exec();
    }

    async findByName(name: string): Promise<Player> {
        return await this.playerModel
            .findOne({
                name: name,
            })
            .exec();
    }

    async findAll(): Promise<Player[]> {
        return await this.playerModel.find().exec();
    }

    async create(createDto: ICreatePlayerDto): Promise<Player> {
        if (await this.playerModel.findOne({ name: createDto.name }).exec())
            throw new ConflictException('Player already exists');

        const newPlayer = new this.playerModel({
            name: createDto.name,
        });

        return await newPlayer.save();
    }

    async update(updateDto: IUpdatePlayerDto): Promise<Player> {
        return await this.playerModel
            .findOneAndUpdate({ name: updateDto.filter.name }, updateDto)
            .exec();
    }

    async delete(filterDto: IFilterPlayerDto): Promise<Player> {
        return await this.playerModel
            .findOneAndDelete({ name: filterDto.name })
            .exec();
    }
}
