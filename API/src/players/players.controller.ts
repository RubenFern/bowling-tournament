import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { isObjectIdOrHexString } from 'mongoose';

import { AuthGuard } from 'src/auth/auth.guard';
import { Player } from 'src/database/schemas/player.schema';
import {
    ICreatePlayerDto,
    IFilterPlayerDto,
    IUpdatePlayerDto,
} from 'src/interfaces/player';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
    constructor(private playerService: PlayersService) {}

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get(':request')
    async get(@Param('request') request: string): Promise<Player> {
        let result = await this.playerService.findByName(request);

        if (!result && isObjectIdOrHexString(request))
            result = await this.playerService.findById(request);

        return result;
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get()
    async getAll(): Promise<Player[]> {
        return this.playerService.findAll();
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post()
    async create(@Body() createDto: ICreatePlayerDto): Promise<Player> {
        return await this.playerService.create(createDto);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Patch()
    async update(@Body() updateDto: IUpdatePlayerDto): Promise<Player> {
        const result = await this.playerService.update(updateDto);

        if (!result) throw new NotFoundException('Player not found');

        return result;
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Delete()
    async delete(filterDto: IFilterPlayerDto): Promise<Player> {
        const result = await this.playerService.delete(filterDto);

        if (!result) throw new NotFoundException('Player not found');

        return result;
    }
}
