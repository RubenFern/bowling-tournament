import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterModule } from "@angular/router";
import { MaterialModules } from "@material";

import { Tournament } from "../../interfaces/tournament.interfaces";
import { TournamentApiService } from "../../services/tournament.service";
import { ConfirmDialog } from "../modals/alerts/confirm.component";
import { AlertMessageComponent } from "../modals/alerts/message.component";
import { AddTournamentComponent } from "../modals/tournament/add.component";
import { UpdateTournamentComponent } from "../modals/tournament/update.component";

@Component({
    standalone: true,
    imports: [
        ...MaterialModules,
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
    ],
    templateUrl: './tournament.component.html',
    styles: ``
})
export class TournamentComponent implements OnInit {

    isLoading = true;
    tournaments: Tournament[] = [];

    constructor(
        private dialog: MatDialog,
        private router: Router,
        private snackBar: MatSnackBar,
        private tournamentApiService: TournamentApiService,
    ) {}

    ngOnInit(): void {
        this.loadTournaments();
    }

    loadTournaments(): void {
        this.isLoading = true;

        this.tournamentApiService
            .getAll()
            .subscribe((data) => {
                this.tournaments = data;
                this.isLoading = false;
            });
    }

    logout(): void {
        localStorage.setItem('token', '');
        this.router.navigate(['/auth']);
    }

    add(): void {
        const dialogRef = this.dialog.open(AddTournamentComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loadTournaments();
                this.showAlert('Torneo añadido correctamente');
            }
        });
    }

    edit(tournament: Tournament): void {
        const dialogRef = this.dialog.open(UpdateTournamentComponent, {  data: tournament.name });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loadTournaments();
                this.showAlert('Torneo actualizado correctamente');
            }
        });
    }

    delete(tournament: Tournament): void {
        const warning: string = '¿Estás seguro de querer borrar el torneo? Se borrarán todas sus partidas';
        const dialogRef = this.dialog.open(ConfirmDialog,  { data: warning });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.tournamentApiService
                    .delete(tournament.name)
                    .subscribe(() => {
                        this.loadTournaments();
                        this.showAlert('Torneo eliminado correctamente');
                    });
            }
        });
    }

    private showAlert(message: string): void
    {
        this.snackBar.openFromComponent(AlertMessageComponent, {
            duration: 4000,
            data: message
        });
    }

}
