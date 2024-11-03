export interface AddGameDto {
    player_id: string;
    tournament_id: string;
    handicap: number;
    game1: number;
    game2: number;
    game3: number;
    game4: number;
    game5: number;
    game6: number;
}

export interface UpdateGameDto {
    filter: IFilterGameDto
    handicap: number;
    game1: number;
    game2: number;
    game3: number;
    game4: number;
    game5: number;
    game6: number;
}

export interface IFilterGameDto {
    player_id: string;
    tournament_id: string;
}

export interface Game {
    player_id: string;
    tournament_id: string;
    handicap: number;
    game1: number;
    game2: number;
    game3: number;
    game4: number;
    game5: number;
    game6: number;
    _id: string;
}
