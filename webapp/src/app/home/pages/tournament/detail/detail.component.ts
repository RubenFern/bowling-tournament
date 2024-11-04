import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MaterialModules } from '@material';
import { forkJoin, of, switchMap } from 'rxjs';

import { Game } from 'app/home/interfaces/game.interfaces';
import { PlayerApiService } from 'app/home/services/player.service';
import { GameApiService } from '../../../services/game.service';
import { UpdateGameComponent } from '../../modals/game/update.component';
import { AddGameComponent } from '../../modals/game/add.component';
import { ConfirmDialog } from '../../modals/alerts/confirm.component';
import { AlertMessageComponent } from '../../modals/alerts/message.component';
import { TournamentApiService } from 'app/home/services/tournament.service';
import { Player } from 'app/home/interfaces/player.interfaces';

export interface GameElement {
    position: number;
    name: string;
    player_id: string;
    tournament_id: string;
    handicap: number;
    game1: number;
    game2: number;
    game3: number;
    game4: number;
    game5: number;
    game6: number;
    media: number;
    total: number;
}

@Component({
    standalone: true,
    imports: [
        ...MaterialModules,
        CommonModule,
        MatTableModule,
        ReactiveFormsModule,
        RouterModule,
    ],
    templateUrl: './detail.component.html',
    styles: ``,
    providers: [
        MatSnackBarModule,
    ]
})
export class DetailComponent implements OnInit {
    displayedColumns: string[] = [
        'position',
        'name',
        'handicap',
        'game1',
        'game2',
        'game3',
        'game4',
        'game5',
        'game6',
        'media',
        'total',
        'options'
    ];
    dataSource: GameElement[] = [];
    gameElements: Game[] = [];
    isLoading: boolean = false;
    title: string = '';
    tournamentId: string = '';

    constructor(
        private activateRoute: ActivatedRoute,
        private dialog: MatDialog,
        private gameApiService: GameApiService,
        private location: Location,
        private playerApiService: PlayerApiService,
        private snackBar: MatSnackBar,
        private tournamentApiService: TournamentApiService,
    ) {}

    ngOnInit(): void {
        this.activateRoute.params.subscribe((params) => {
            const tournamentId: string = params['tournamentId'];

            if (!tournamentId) {
                this.location.back();
                return;
            }

            this.tournamentId = tournamentId;

            this.tournamentApiService
                .get(tournamentId)
                .subscribe((tournament) => {
                    if (!tournament) {
                        this.location.back();
                        return;
                    }

                    this.title = tournament.name;

                    this.loadGames();
                });

        });
    }

    loadGames(): void {
        this.isLoading = true;
        this.gameApiService
            .getAll(this.tournamentId)
            .pipe(
                switchMap((games) => {
                    if (games.length === 0) {
                        this.gameElements = [];
                        this.dataSource = [];
                        this.isLoading = false;
                        return of();
                    }

                    this.gameElements = games;
                    const playerObservables = games.map((game, index) =>
                        this.playerApiService.get(game.player_id).pipe(
                            switchMap((player) => {
                                const handicap: number = game.handicap || 0;
                                const game1: number = this.getValueGame(game.game1 || 0, handicap);
                                const game2: number = this.getValueGame(game.game2 || 0, handicap);
                                const game3: number = this.getValueGame(game.game3 || 0, handicap);
                                const game4: number = this.getValueGame(game.game4 || 0, handicap);
                                const game5: number = this.getValueGame(game.game5 || 0, handicap);
                                const game6: number = this.getValueGame(game.game6 || 0, handicap);

                                const total = game1 + game2 + game3 + game4 + game5 + game6;

                                return of({
                                    position: index + 1,
                                    name: player ? player.name : 'Desconocido',
                                    player_id: game.player_id,
                                    tournament_id: game.tournament_id,
                                    handicap: handicap,
                                    game1: game1,
                                    game2: game2,
                                    game3: game3,
                                    game4: game4,
                                    game5: game5,
                                    game6: game6,
                                    media: this.calculateMedia(game),
                                    total: total,
                                });
                            })
                        )
                    );
                    // Wait for all observables to finish
                    return forkJoin(playerObservables);
                })
            )
            .subscribe((elements: GameElement[]) => {
                elements.sort((a, b) => b.total - a.total);

                elements.forEach((element, index) => element.position = index + 1);
                this.dataSource = elements;
                this.isLoading = false;
            });
    }

    private getValueGame(value: number, handicap: number): number {
        if (value === 0)
            return value;

        return value + handicap;
    }

    private calculateMedia(game: Game): number {
        let total = 0, num = 0;
        const handicap: number = game.handicap || 0;
        const game1: number = this.getValueGame(game.game1 || 0, handicap);
        const game2: number = this.getValueGame(game.game2 || 0, handicap);
        const game3: number = this.getValueGame(game.game3 || 0, handicap);
        const game4: number = this.getValueGame(game.game4 || 0, handicap);
        const game5: number = this.getValueGame(game.game5 || 0, handicap);
        const game6: number = this.getValueGame(game.game6 || 0, handicap);

        if (game1 !== 0) {
            total += game1;
            num++;
        }

        if (game2 !== 0) {
            total += game2;
            num++;
        }

        if (game3 !== 0) {
            total += game3;
            num++;
        }

        if (game4 !== 0) {
            total += game4;
            num++;
        }

        if (game5 !== 0) {
            total += game5;
            num++;
        }

        if (game6 !== 0) {
            total += game6;
            num++;
        }

        if (num === 0)
            return 0;

        return Math.round(total / num);
    }

    add(): void {
        const dialogRef = this.dialog.open(AddGameComponent, { data: this.tournamentId });
        const componentInstance = dialogRef.componentInstance as AddGameComponent;

        dialogRef.afterClosed().subscribe(() => {
            componentInstance.save().subscribe(res => {
                if (!res) return;

                this.loadGames();
                this.showAlert('Partida añadida correctamente');
            });
        });
    }

    edit(game: GameElement): void {
        const data: any = this.gameElements.find((element) => element.player_id === game.player_id) || undefined;

        if (!data)
            return;

        data.name = game.name;

        const dialogRef = this.dialog.open(UpdateGameComponent, {
            data: data,
        });

        dialogRef.afterClosed().subscribe(res => {
            if (!res) return;

            this.loadGames();
            this.showAlert('Partida editada correctamente');
        });
    }

    delete(playerId: string): void {
        const warning: string = '¿Estás seguro de querer borrar la partida?';
        const dialogRef = this.dialog.open(ConfirmDialog, { data: warning });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.gameApiService
                    .delete({
                        player_id: playerId,
                        tournament_id: this.tournamentId
                    })
                    .subscribe(() => {
                        this.loadGames();
                        this.showAlert('Partida eliminada correctamente');
                    });
            }
        });
    }

    back(): void {
        this.location.back();
    }

    private showAlert(message: string): void
    {
        this.snackBar.openFromComponent(AlertMessageComponent, {
            duration: 4000,
            data: message
        });
    }
}
