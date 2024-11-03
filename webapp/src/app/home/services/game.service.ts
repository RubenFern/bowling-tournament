import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

import { environment } from 'app/environments/environments';
import {
    AddGameDto,
    Game,
    UpdateGameDto,
    IFilterGameDto,
} from '../interfaces/game.interfaces';

@Injectable({
    providedIn: 'root',
})
export class GameApiService {
    private BASE_GAME_URL = `${ environment.apiUrl }/games`;

    constructor(private http: HttpClient) {}

    private headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    public get(playerId: string, tournamentId: string): Observable<Game | null> {
        return this.http.get<Game>(
            `${this.BASE_GAME_URL}/${ playerId }/${ tournamentId }`,
            { headers: this.headers }
        );
    }

    public getAll(tournamentId: string): Observable<Game[]> {
        return this.http.get<Game[]>(
            `${this.BASE_GAME_URL}/${ tournamentId }`,
            { headers: this.headers }
        );
    }

    public add(
        createDto: AddGameDto
    ): Observable<Game | null> {
        return this.http
            .post<Game>(
                this.BASE_GAME_URL,
                {
                    player_id: createDto.player_id,
                    tournament_id: createDto.tournament_id,
                    handicap: createDto.handicap,
                    game1: createDto.game1,
                    game2: createDto.game2,
                    game3: createDto.game3,
                    game4: createDto.game4,
                    game5: createDto.game5,
                    game6: createDto.game6,
                },
                { headers: this.headers }
            )
            .pipe(
                map((response) => response),
                catchError(() => of(null))
            );
    }

    public update(
        updateDto: UpdateGameDto
    ): Observable<Game | null> {
        return this.http
            .patch<Game>(
                this.BASE_GAME_URL,
                {
                    filter: updateDto.filter,
                    handicap: updateDto.handicap,
                    game1: updateDto.game1,
                    game2: updateDto.game2,
                    game3: updateDto.game3,
                    game4: updateDto.game4,
                    game5: updateDto.game5,
                    game6: updateDto.game6,
                },
                { headers: this.headers }
            )
            .pipe(
                map((response) => response),
                catchError(() => of(null))
            );
    }

    public delete(filter: IFilterGameDto): Observable<boolean> {
        return this.http
            .delete(
                this.BASE_GAME_URL,
                {
                    headers: this.headers,
                    body: filter
                }
            )
            .pipe(
                map(() => true),
                catchError(() => of(false))
            );
    }
}
