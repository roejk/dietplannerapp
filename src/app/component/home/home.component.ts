import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
    private localStorage: LocalStorageService,
    private router: Router,
    private decoder: TokenDecoderService
  ) {}

  goToRegisterPage() {
    this.router.navigate(['register']);
  }

  isLoggedIn() {
    return this.localStorage.isLoggedIn();
  }

}
