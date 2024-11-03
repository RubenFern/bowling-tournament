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

import { AuthGuard } from 'src/auth/auth.guard';
import { Game } from 'src/database/schemas/game.schema';
import {
    ICreateGameDto,
    IFilterGameDto,
    IUpdateGameDto,
} from 'src/interfaces/game';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
    constructor(private gameService: GamesService) {}

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get(':playerId/:tournamentId')
    async getByPlayerIdAndTournamentId(
        @Param('playerId') playerId: string,
        @Param('tournamentId') tournamentId: string,
    ): Promise<Game> {
        return await this.gameService.findByPlayerIdAndTournamentId(
            playerId,
            tournamentId,
        );
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get(':tournamentId')
    async getAll(@Param('tournamentId') tournamentId: string): Promise<Game[]> {
        return this.gameService.findAll(tournamentId);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post()
    async create(@Body() createDto: ICreateGameDto): Promise<Game> {
        return await this.gameService.create(createDto);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Patch()
    async update(@Body() updateDto: IUpdateGameDto): Promise<Game> {
        const result = await this.gameService.update(updateDto);

        if (!result) throw new NotFoundException('Game not found');

        return result;
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Delete()
    async delete(@Body() filterDto: IFilterGameDto): Promise<Game> {
        const result = await this.gameService.delete(filterDto);

        if (!result) throw new NotFoundException('Game not found');

        return result;
    }
}
