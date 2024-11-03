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
import { Tournament } from 'src/database/schemas/tournament.schema';
import {
    ICreateTournamentDto,
    IFilterTournamentDto,
    IUpdateTournamentDto,
} from 'src/interfaces/tournament';
import { TournamentsService } from './tournaments.service';

@Controller('tournaments')
export class TournamentsController {
    constructor(private tournamentService: TournamentsService) {}

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get(':request')
    async get(@Param('request') request: string): Promise<Tournament> {
        let result = await this.tournamentService.findByName(request);

        if (!result && isObjectIdOrHexString(request))
            result = await this.tournamentService.findById(request);

        return result;
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get()
    async getAll(): Promise<Tournament[]> {
        return this.tournamentService.findAll();
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post()
    async create(@Body() createDto: ICreateTournamentDto): Promise<Tournament> {
        return await this.tournamentService.create(createDto);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Patch()
    async update(@Body() updateDto: IUpdateTournamentDto): Promise<Tournament> {
        const result = await this.tournamentService.update(updateDto);

        if (!result) throw new NotFoundException('Tournament not found');

        return result;
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Delete()
    async delete(@Body() filterDto: IFilterTournamentDto): Promise<Tournament> {
        const result = await this.tournamentService.delete(filterDto);

        if (!result) throw new NotFoundException('Tournament not found');

        return result;
    }
}
