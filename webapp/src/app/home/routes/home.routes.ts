import { Routes } from '@angular/router';

import { TournamentComponent } from '../pages/tournament/tournament.component';
import { DetailComponent } from '../pages/tournament/detail/detail.component';

export const routes: Routes = [
    {
        path: '',
        component: TournamentComponent
    },
    {
        path: ':tournamentId',
        component: DetailComponent
    }
];
