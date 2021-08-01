import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { User } from '../models/User.model';
import { HttpParams } from '@angular/common/http';
import { GridResponse } from 'src/app/shared/table';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiService: ApiService) {}

  /**
   * ROTA COM USUARIO
   */
  urlFindAllUser(): string{
    return `${environment.api_url}/usuario`;
  }

  post(user: User): Observable<any> {
    return this.apiService.post(`/usuario`, { ...user });
  }

  put(id: number, user: User): Observable<any> {
    return this.apiService.put(`/usuario/${id}`, { ...user });
  }

  /**
   * Pega os dadoss do orçamento
   */
  get(id: number): Observable<any>{
    return this.apiService.get(`/usuario/todos/${id}`);
  }

  /**
   * Pega os dadoss do orçamento
   */
  getAllLogist(): Observable<any>{
    return this.apiService.get(`/usuario/logista`);
  }

/**
   * Pega os dadoss do orçamento
   */
  getAllClient(): Observable<any>{
    return this.apiService.get(`/usuario/cliente`);
  }

  queryLogist(params?: HttpParams, expand?: string): Observable<GridResponse> {
    if (expand) {
      params = params.set('expand', expand);
    }

    return this.apiService.get(`/usuario/logista`, params);
  }

  queryClient(params?: HttpParams, expand?: string): Observable<GridResponse> {
    if (expand) {
      params = params.set('expand', expand);
    }

    return this.apiService.get(`/usuario/cliente`, params);
  }
}
