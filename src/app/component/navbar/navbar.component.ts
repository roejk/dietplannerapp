import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { LocalStorageService } from 'src/app/service/local-storage/local-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private authService: AuthenticationService
  ) {}

  navigate(route: string) {
    this.router.navigate([route]);
  }

  isLoggedIn() {
    return this.localStorage.isLoggedIn();
  }

  isAdmin() {
    return true;
  }

  logout() {
    this.authService.logout();
    this.navigate('');
  }
}
