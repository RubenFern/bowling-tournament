import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModules } from '@material';

import { User } from 'app/auth/interfaces/auth.interface';
import { AuthService } from 'app/auth/services/auth.service';

@Component({
    standalone: true,
    imports: [
        ...MaterialModules,
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
    ],
    templateUrl: './login.component.html',
    styles: ``,
})
export class LoginComponent {
    public errorLogin: boolean = false;
    public errorUsername: string = 'Nombre de usuario incorrecto';
    public errorEmptyUsername: boolean = false;
    public errorPassword: string = 'Contraseña incorrecta';
    public errorEmptyPassword: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    public userForm = new FormGroup({
        username: new FormControl<string>(''),
        password: new FormControl<string>(''),
    });

    get currentUser(): User {
        return this.userForm.value as User;
    }

    public onLogin() {
        if (this.thereAreEmptyFields()) return;

        this.authService
            .login(this.currentUser.username, this.currentUser.password)
            .subscribe((response) => {
                this.errorLogin = !response;

                if (this.errorLogin) {
                    this.userForm.controls.username.setErrors({
                        notMatched: true,
                    });
                    this.userForm.controls.password.setErrors({
                        notMatched: true,
                    });
                } else {
                    this.userForm.controls.username.setErrors(null);
                    this.userForm.controls.password.setErrors(null);

                    this.router.navigateByUrl('/tournaments');
                }
            });
    }

    private thereAreEmptyFields(): boolean {
        this.errorEmptyUsername = this.currentUser.username === '';
        this.errorEmptyPassword = this.currentUser.password === '';
        this.errorLogin = false;

        return this.errorEmptyUsername || this.errorEmptyPassword;
    }
}
