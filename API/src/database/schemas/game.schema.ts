import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Game extends Document {
    @Prop({ required: true })
    player_id: Types.ObjectId;

    @Prop({ required: true })
    tournament_id: Types.ObjectId;

    @Prop({ default: 0 })
    handicap: number;

    @Prop({ default: 0 })
    game1: number;

    @Prop({ default: 0 })
    game2: number;

    @Prop({ default: 0 })
    game3: number;

    @Prop({ default: 0 })
    game4: number;

    @Prop({ default: 0 })
    game5: number;

    @Prop({ default: 0 })
    game6: number;
}

export const GameSchema = SchemaFactory.createForClass(Game);