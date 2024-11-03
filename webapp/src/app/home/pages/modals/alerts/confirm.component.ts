import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModules } from '@material';

@Component({
    selector: 'alert-confirm',
    templateUrl: 'confirm.component.html',
    standalone: true,
    imports: [...MaterialModules],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialog {
    constructor(@Inject(MAT_DIALOG_DATA) public warning: string) {}
}
