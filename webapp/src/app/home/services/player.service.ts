import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, map, Observable, of } from 'rxjs';

import { environment } from 'app/environments/environments';
import {
    AddPlayerDto,
    Player,
    UpdatePlayerDto,
} from '../interfaces/player.interfaces';

@Injectable({
    providedIn: 'root',
})
export class PlayerApiService {
    private BASE_PLAYER_URL = `${ environment.apiUrl }/players`;

    constructor(private http: HttpClient) {}

    private headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    public get(id: string): Observable<Player | null> {
        return this.http.get<Player>(
            `${this.BASE_PLAYER_URL}/${ id }`,
            { headers: this.headers }
        );
    }

    public getByName(name: string): Observable<Player | null> {
        return this.http.get<Player>(
            `${this.BASE_PLAYER_URL}/${ name }`,
            { headers: this.headers }
        );
    }

    public getAll(): Observable<Player[]> {
        return this.http.get<Player[]>(
            this.BASE_PLAYER_URL,
            { headers: this.headers }
        );
    }

    public add(
        createDto: AddPlayerDto
    ): Observable<Player | null> {
        return this.http
            .post<Player>(
                this.BASE_PLAYER_URL,
                { name: createDto.name },
                { headers: this.headers }
            )
            .pipe(
                map((response) => response),
                catchError(() => of(null))
            );
    }

    public update(
        name: string,
        updateDto: UpdatePlayerDto
    ): Observable<Player | null> {
        return this.http
            .patch<Player>(
                this.BASE_PLAYER_URL,
                {
                    filter: { name },
                    name: updateDto.name
                },
                { headers: this.headers }
            )
            .pipe(
                map((response) => response),
                catchError(() => of(null))
            );
    }

    public delete(name: string): Observable<boolean> {
        return this.http
            .delete(`${this.BASE_PLAYER_URL}/${name}`, {
                headers: this.headers,
            })
            .pipe(
                map(() => true),
                catchError(() => of(false))
            );
    }
}
