import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { ApiService } from './api.service';
import { shareReplay, tap } from 'rxjs/operators';

export enum SessionName {
  ID = 'ID',
  NAME = 'NAME',
  EMAIL = 'EMAIL',
  IS_BATEU = 'IS_BATEU',
  ACCOUNT_ID = 'ACCOUNT_ID',
  TOKEN = 'TOKEN',
  ESTABLISHMENT_ID = 'ESTABLISHMENT_ID',
  CELLPHONE = 'CELLPHONE',
  SHOP_ID = 'SHOP_ID',
  SHOP_NAME = 'SHOP_NAME'
}

export interface IJWTPayload {
  id: number,
  name: string,
  email: string,
  account_id: number,
  token: string,
  is_bateu: boolean;
  establishment_id: number;
  cellphone: string;
  shop_name: string;
  shop_id: number;
}

export interface IRequestLogin {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apiService: ApiService) {}

  login({email, password}: IRequestLogin){
    return this.apiService.post('/signin', {email, senha: password})
      .pipe(
        tap(res => this.setSession(res)),
        shareReplay()
      )
  }

  isClient(): boolean {
    return localStorage.getItem(SessionName.ESTABLISHMENT_ID) === '0' && localStorage.getItem(SessionName.SHOP_ID) === '0';
  }

  sendForgotPassword(email: string){
    return this.apiService.post('/password/forgot', {email});
  }

  recovery(password: string, token: string){
    return this.apiService.post('/password/reset', {password, token});
  }

  /**
   * Get active token
   *
   * @returns string
   */
  getToken(): string {
    return localStorage.getItem(SessionName.TOKEN);
  }

  /**
   * Logout the user
   */
  logout() {
    localStorage.removeItem(SessionName.ID);
    localStorage.removeItem(SessionName.NAME);
    localStorage.removeItem(SessionName.EMAIL);
    localStorage.removeItem(SessionName.ACCOUNT_ID);
    localStorage.removeItem(SessionName.IS_BATEU);
    localStorage.removeItem(SessionName.TOKEN);
    localStorage.removeItem(SessionName.ESTABLISHMENT_ID);
    localStorage.removeItem(SessionName.CELLPHONE);
    localStorage.removeItem(SessionName.SHOP_ID);
    localStorage.removeItem(SessionName.SHOP_NAME);
  }

  private setSession(result: any) {
    const token = result.token;
    const payload = jwtDecode(token) as IJWTPayload;

    localStorage.setItem(SessionName.ID, payload.id.toString());
    localStorage.setItem(SessionName.NAME, payload.name);
    localStorage.setItem(SessionName.EMAIL, payload.email);
    localStorage.setItem(SessionName.IS_BATEU, String(payload.is_bateu));
    localStorage.setItem(SessionName.ACCOUNT_ID, payload.account_id.toString());
    localStorage.setItem(SessionName.TOKEN, result.token);
    localStorage.setItem(SessionName.ESTABLISHMENT_ID, String(payload.establishment_id));
    localStorage.setItem(SessionName.CELLPHONE, payload.cellphone)
    localStorage.setItem(SessionName.SHOP_ID, String(payload.shop_id));
    localStorage.setItem(SessionName.SHOP_NAME, payload.shop_name);
  }

  /**
   * EMAIL USUARIO LOGADO
   */
  getEmail(): string{
    return localStorage.getItem(SessionName.EMAIL);
  }

  /**
   * NOME USUARIO LOGADO
   */
  getUsername(): string{
    return localStorage.getItem(SessionName.NAME);
  }

  getShopID(): number{
    return Number(localStorage.getItem(SessionName.SHOP_ID));
  }

  getID(): number{
    return Number(localStorage.getItem(SessionName.ID));
  }

  getShopName(): string{
    return localStorage.getItem(SessionName.SHOP_NAME);
  }

  getCellphone(): string {
    return localStorage.getItem(SessionName.CELLPHONE);
  }

  getEstablishmentID(): number{
    return Number(localStorage.getItem(SessionName.ESTABLISHMENT_ID));
  }
}
