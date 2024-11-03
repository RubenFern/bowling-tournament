import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MaterialModules } from "@material";

import { Tournament, UpdateTournamentDto } from "app/home/interfaces/tournament.interfaces";
import { TournamentApiService } from "app/home/services/tournament.service";

@Component({
    selector: 'update-tournament',
    templateUrl: 'add-update.component.html',
    standalone: true,
    imports: [
        ...MaterialModules,
        CommonModule,
        ReactiveFormsModule,
    ],
})
export class UpdateTournamentComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private data: string,
        private tournamentApiService: TournamentApiService,
    ) {}

    public tournamentForm = new FormGroup({
        name: new FormControl<string>(this.data)
    });

    get currentTournament(): Tournament {
        return this.tournamentForm.value as Tournament;
    }

    save(): boolean {
        if (!this.currentTournament.name || this.currentTournament.name === '')
            return false;

        if (this.currentTournament.name === this.data)
            return false;

        const updateDto: UpdateTournamentDto = {
            name: this.currentTournament.name
        };

        this.tournamentApiService
            .update(this.data, updateDto)
            .subscribe((data) => {
                if (data)
                    return true;

                return false;
            });

        return false;
    }

}
