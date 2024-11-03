import { JwtPayload } from "jwt-decode";

export interface LoginResponse {
    success: boolean;
    access_token: string;
}

export interface User {
    username: string;
    password: string;
}

export interface MyJwtPayload extends JwtPayload {
    username: string;
}
