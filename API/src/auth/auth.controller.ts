import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { ISignInDto, ISignUpDto } from 'src/interfaces/user';
import { User } from 'src/database/schemas/user.schema';

@Controller('auth')
export class AuthController {
    
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: ISignInDto) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @HttpCode(HttpStatus.OK)
    @Post('register')
    signUp(@Body() signUnDto: ISignUpDto): Promise<User> {
        return this.authService.signUp(signUnDto);
    }
    
}
