import { Component } from '@angular/core';
// import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  goToUsersPage() {
    console.log('users route');
    this.router.navigate(['users']);
  }

  goToRegisterPage() {
    this.router.navigate(['register']);
  }

  showHello() {
    this.authService.hello().subscribe({
      next: () => {
        console.log('ok');
      },
    });
  }
}
