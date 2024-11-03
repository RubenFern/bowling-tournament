import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {

    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit() {
        this.verifyToken();
    }

    private verifyToken(): void {
        if (!this.authService.verifyToken()) {
            localStorage.setItem('token', '');
            this.router.navigate(['/auth']);
        }
    }
}
