import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModules } from '@material';

import { AddGameDto } from 'app/home/interfaces/game.interfaces';
import { AddPlayerDto } from 'app/home/interfaces/player.interfaces';
import { GameApiService } from 'app/home/services/game.service';
import { PlayerApiService } from 'app/home/services/player.service';
import { GameElement } from '../../tournament/detail/detail.component';
import { Observable, of, switchMap } from 'rxjs';

@Component({
    selector: 'add-game',
    templateUrl: 'add-update.component.html',
    standalone: true,
    imports: [
        ...MaterialModules,
        CommonModule,
        ReactiveFormsModule,
    ],
})
export class AddGameComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private tournamentId: string,
        private gameApiService: GameApiService,
        private playerApiService: PlayerApiService,
    ) {}

    public gameForm = new FormGroup({
        name: new FormControl<string>(''),
        handicap: new FormControl<number>(0),
        game1: new FormControl<number>(0),
        game2: new FormControl<number>(0),
        game3: new FormControl<number>(0),
        game4: new FormControl<number>(0),
        game5: new FormControl<number>(0),
        game6: new FormControl<number>(0),
    });

    get currentGame(): GameElement {
        return this.gameForm.value as GameElement;
    }

    save(): Observable<any> {
        if (!this.currentGame.name || this.currentGame.name === '')
            return of(null);

        const createPlayerDto: AddPlayerDto = {
            name: this.currentGame.name,
        };

        return this.playerApiService
            .get(this.currentGame.name)
            .pipe(
                switchMap(player => {
                    if (player)
                        return of(player);

                    return this.playerApiService.add(createPlayerDto);
                }),
                switchMap(player => {
                    if (!player) return of(null);

                    const createGameDto: AddGameDto = {
                        player_id: player._id,
                        tournament_id: this.tournamentId,
                        handicap: this.currentGame.handicap,
                        game1: this.currentGame.game1,
                        game2: this.currentGame.game2,
                        game3: this.currentGame.game3,
                        game4: this.currentGame.game4,
                        game5: this.currentGame.game5,
                        game6: this.currentGame.game6,
                    };

                    return this.gameApiService.add(createGameDto);
                })
            );
    }
}
