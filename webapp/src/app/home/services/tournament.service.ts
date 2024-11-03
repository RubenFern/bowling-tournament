import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

import { environment } from 'app/environments/environments';
import {
    AddTournamentDto,
    Tournament,
    UpdateTournamentDto,
} from '../interfaces/tournament.interfaces';

@Injectable({
    providedIn: 'root',
})
export class TournamentApiService {
    private BASE_TOURNAMENTS_URL = `${ environment.apiUrl }/tournaments`;

    constructor(private http: HttpClient) {}

    private headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    public get(name: string): Observable<Tournament | null> {
        return this.http.get<Tournament>(
            `${this.BASE_TOURNAMENTS_URL}/${ name }`,
            { headers: this.headers }
        );
    }

    public getAll(): Observable<Tournament[]> {
        return this.http.get<Tournament[]>(
            this.BASE_TOURNAMENTS_URL,
            { headers: this.headers }
        );
    }

    public add(
        createDto: AddTournamentDto
    ): Observable<Tournament | null> {
        return this.http
            .post<Tournament>(
                this.BASE_TOURNAMENTS_URL,
                { name: createDto.name },
                { headers: this.headers }
            )
            .pipe(
                map((response) => response),
                catchError(() => of(null))
            );
    }

    public update(
        name:string,
        updateDto: UpdateTournamentDto
    ): Observable<Tournament | null> {
        return this.http
            .patch<Tournament>(
                this.BASE_TOURNAMENTS_URL,
                {
                    filter: {
                        name: name
                    },
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
            .delete(this.BASE_TOURNAMENTS_URL,
                {
                    headers: this.headers,
                    body: { name }
                }
            )
            .pipe(
                map(() => true),
                catchError(() => of(false))
            );
    }
}
