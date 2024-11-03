import { ConflictException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from 'src/database/schemas/user.schema';
import { ISignUpDto } from 'src/interfaces/user';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    private saltOrRounds = 12;

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(username: string, password: string): Promise<any> {
        const user: User = await this.usersService.findOne(username);

        if (!await this.comparePasswords(password, user?.password)) 
            throw new UnauthorizedException();

        const payload = { username: user?.username };

        return { 
            success: true,
            access_token: await this.jwtService.signAsync(payload) 
        };
    }

    async signUp(signUpDto: ISignUpDto): Promise<User> {
        if (signUpDto.password !== signUpDto.confirmPassword)
            throw new UnauthorizedException('Passwords do not match');

        if (await this.usersService.findOne(signUpDto.username))
            throw new ConflictException('User already exists');

        const hashPass = await bcrypt.hash(signUpDto.password, this.saltOrRounds)
    
        return await this.usersService.create(signUpDto.username ,hashPass);
      }

    private async comparePasswords(pass1: string, pass2: string): Promise<boolean> {
        if (!pass1 || !pass2)
            return false;

        return await bcrypt.compare(pass1, pass2);
    }
}
