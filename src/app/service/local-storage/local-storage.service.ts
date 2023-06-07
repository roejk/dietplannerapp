import { Injectable } from '@angular/core';
import { DecodedToken } from '../token-decoder/token-decoder.service';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  clear(): void {
    localStorage.clear();
  }

  getItem(key: string): string {
    try {
      const item = localStorage.getItem(key);
      return item;
    } catch (e) {
      console.error(e);
      throw new Error(`Error getting item for this key: ${key}`);
    }
  }

  isLoggedIn(): boolean {
    if (this.getItem('token') != null) {
      const token = this.getItem('token');
      const decoded: DecodedToken = jwt_decode(token);
      if (this.checkIfTokenExpired(decoded)) {
        const refreshToken = this.getItem('refreshToken');
        const refreshDecoded: DecodedToken = jwt_decode(refreshToken);
        if (this.checkIfTokenExpired(refreshDecoded)) {
          return false;
        }
      }
    }
    return this.getItem('token') != null;
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  checkIfTokenExpired(token: DecodedToken): boolean {
    return new Date(token.exp * 1000) <= new Date();
  }
}
