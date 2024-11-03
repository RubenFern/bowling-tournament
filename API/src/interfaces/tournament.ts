export interface ICreateTournamentDto {
    name: string;
}

export interface IUpdateTournamentDto {
    filter: IFilterTournamentDto;
    name: string;
}

export interface IFilterTournamentDto {
    name: string;
}