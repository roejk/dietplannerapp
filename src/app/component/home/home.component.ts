import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { LocalStorageService } from 'src/app/service/local-storage/local-storage.service';
import { TokenDecoderService } from 'src/app/service/token-decoder/token-decoder.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  username = this.decoder.getUsernameFromToken();

  constructor(
    private authService: AuthenticationService,
    private localStorage: LocalStorageService,
    private router: Router,
    private decoder: TokenDecoderService
  ) {}

  goToUsersPage() {
    console.log('users route');
    this.router.navigate(['users']);
  }

  goToRegisterPage() {
    this.router.navigate(['register']);
  }

  isLoggedIn() {
    return this.localStorage.isLoggedIn();
  }

  showHello() {
    this.authService.hello().subscribe({
      next: () => {
        console.log('ok');
      },
    });
  }
}
