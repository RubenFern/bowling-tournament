import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MaterialModules } from "@material";
import { AddTournamentDto, Tournament } from "app/home/interfaces/tournament.interfaces";
import { TournamentApiService } from "app/home/services/tournament.service";

@Component({
    selector: 'add-tournament',
    templateUrl: 'add-update.component.html',
    standalone: true,
    imports: [
        ...MaterialModules,
        CommonModule,
        ReactiveFormsModule,
    ],
})
export class AddTournamentComponent {

    constructor(
        private tournamentApiService: TournamentApiService,
    ) {}

    public tournamentForm = new FormGroup({
        name: new FormControl<string>('')
    });

    get currentTournament(): Tournament {
        return this.tournamentForm.value as Tournament;
    }

    save(): boolean {
        if (!this.currentTournament.name || this.currentTournament.name === '')
            return false;

        const createDto: AddTournamentDto = {
            name: this.currentTournament.name
        };

        this.tournamentApiService
            .add(createDto)
            .subscribe((data) => {
                if (data)
                    return true;

                return false;
            });

        return false;
    }

}
