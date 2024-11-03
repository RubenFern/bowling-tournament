export interface ICreatePlayerDto {
    name: string;
}

export interface IUpdatePlayerDto {
    filter: IFilterPlayerDto;
    name: string;
}

export interface IFilterPlayerDto {
    id: string;
    name: string;
}