import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MaterialModules } from '@material';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        ...MaterialModules
    ],
    templateUrl: './message.component.html',
    styles: ``
})
export class AlertMessageComponent
{
    constructor(@Inject(MAT_SNACK_BAR_DATA) public message: string) {}
}
