import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModules } from '@material';

import { GameElement } from '../../tournament/detail/detail.component';
import { UpdateGameDto } from 'app/home/interfaces/game.interfaces';
import { GameApiService } from 'app/home/services/game.service';
import { PlayerApiService } from 'app/home/services/player.service';

@Component({
    selector: 'update-game',
    templateUrl: 'add-update.component.html',
    standalone: true,
    imports: [
        ...MaterialModules,
        CommonModule,
        ReactiveFormsModule,
    ],
})
export class UpdateGameComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private data: GameElement,
        private gameApiService: GameApiService,
        private playerApiService: PlayerApiService,
    ) {}

    public gameForm = new FormGroup({
        name: new FormControl<string>(this.data.name),
        handicap: new FormControl<number>(this.data.handicap),
        game1: new FormControl<number>(this.data.game1),
        game2: new FormControl<number>(this.data.game2),
        game3: new FormControl<number>(this.data.game3),
        game4: new FormControl<number>(this.data.game4),
        game5: new FormControl<number>(this.data.game5),
        game6: new FormControl<number>(this.data.game6),
    });

    get currentGame(): GameElement {
        return this.gameForm.value as GameElement;
    }

    save(): void {
        const updateDto: UpdateGameDto = {
            filter: {
                player_id: this.data.player_id,
                tournament_id: this.data.tournament_id,
            },
            handicap: this.currentGame.handicap,
            game1: this.currentGame.game1,
            game2: this.currentGame.game2,
            game3: this.currentGame.game3,
            game4: this.currentGame.game4,
            game5: this.currentGame.game5,
            game6: this.currentGame.game6,
        }

        if (this.data.name !== this.currentGame.name) {
            this.playerApiService
                .update(
                    this.data.name,
                    { name: this.currentGame.name }
                )
                .subscribe(() => {});
        }

        this.gameApiService
            .update(updateDto)
            .subscribe(() => {});
    }
}
