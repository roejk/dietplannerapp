import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';
import jwt_decode from 'jwt-decode';

export interface DecodedToken {
  authorities: string[];
  exp: number;
  iss: string;
  sub: string;
}

@Injectable({
  providedIn: 'root',
})
export class TokenDecoderService {
  constructor(private localStorageService: LocalStorageService) {}

  getUsernameFromToken(): string {
    const token = this.localStorageService.getItem('token');
    if (token) {
      const decoded: DecodedToken = jwt_decode(token);
      return decoded.sub;
    } else {
      return '';
    }
  }
}
