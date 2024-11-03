import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'src/database/schemas/user.schema';

@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async create(username: string, password: string): Promise<User> {
        const newUser = new this.userModel({
            username: username,
            password: password
        });

        return newUser.save();
    }

    async findOne(username: string): Promise<User> {
        return this.userModel
            .findOne({ username })
            .exec();
    }
}
