import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {
  CreateEmpleadoRequest,
  GetEmpleadoResponse,
  UpdateEmpleadoRequest,
} from '../interfaces/empleado-dtos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  private http = inject(HttpClient);
  private endPoint = `${environment.apiUrl}/empleado`;

  getAll(): Observable<GetEmpleadoResponse[]> {
    return this.http.get<GetEmpleadoResponse[]>(`${this.endPoint}/getAll`);
  }

  getById(id: number): Observable<GetEmpleadoResponse> {
    return this.http.get<GetEmpleadoResponse>(`${this.endPoint}/getById?id=${id}`);
  }

  create(req: CreateEmpleadoRequest): Observable<void> {
    const formData = new FormData();

    formData.append('nombreCompleto', req.nombreCompleto);
    formData.append('correo', req.correo);
    formData.append('salario', req.salario.toString());
    formData.append('departamentoID', req.departamentoID.toString());
    if (req.imagen) {
      formData.append('imagen', req.imagen);
    }

    return this.http.post<void>(`${this.endPoint}/create`, formData);
  }
  actualizar(req: UpdateEmpleadoRequest): Observable<void> {
    const formData = new FormData();

    formData.append('id', req.id.toString());
    formData.append('nombreCompleto', req.nombreCompleto);
    formData.append('correo', req.correo);
    formData.append('salario', req.salario.toString());
    formData.append('departamentoID', req.departamentoID.toString());

    if (req.imagen) {
      formData.append('imagen', req.imagen);
    }

    return this.http.put<void>(`${this.endPoint}/actualizar`, formData);
  }
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endPoint}/eliminar/${id}`);
  }
}
