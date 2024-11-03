import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, catchError, map, of } from 'rxjs';

import { environment } from '../../environments/environments';
import { LoginResponse, MyJwtPayload } from '../interfaces/auth.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    constructor(private http: HttpClient) {}

    public login(username: string, password: string): Observable<boolean> {
        return this.http
            .post<LoginResponse>(`${ environment.apiUrl }/auth/login`, {
                username,
                password,
            })
            .pipe(
                map((response) => {
                    if (response.success)
                        localStorage.setItem('token', response.access_token);

                    return response.success;
                }),
                catchError(() => of(false))
            );
    }

    public isAuthenticated(): boolean {
        return this.verifyToken();
    }

    public verifyToken(): boolean {
        const decode = this.decodeToken();

        if (decode === null) return false;

        const timeExpire: number = (decode.exp ?? 0) * 1000;

        return !!decode && timeExpire - Date.now() > 0;
    }

    private decodeToken(): MyJwtPayload | null {
        try {
            const token = localStorage.getItem('token');

            if (!token) return null;

            const decode: MyJwtPayload = jwtDecode(token);

            if (decode) return decode;

            return null;
        } catch (err) {
            return null;
        }
    }
}
