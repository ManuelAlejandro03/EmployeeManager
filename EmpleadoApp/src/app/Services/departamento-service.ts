import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { GetDepartamentoResponse } from '../interfaces/departamento-dtos';

@Injectable({
  providedIn: 'root',
})
export class DepartamentoService {
  private http = inject(HttpClient);
  private endPoint = `${environment.apiUrl}/departamento`;

  getAll(): Observable<GetDepartamentoResponse[]> {
    return this.http.get<GetDepartamentoResponse[]>(`${this.endPoint}/getAll`);
  }
}
