export interface CreateEmpleadoRequest {
  nombreCompleto: string;
  correo: string;
  salario: number;
  imagen?: File;
  departamentoID: number;
}

export interface UpdateEmpleadoRequest {
  id: number;
  nombreCompleto: string;
  correo: string;
  salario: number;
  imagen?: File | null;
  departamentoID: number;
}

export interface GetEmpleadoResponse {
  id: number;
  nombreCompleto: string;
  correo: string;
  salario: number;
  imagenUrl: string;
  nombreDepartamento: string;
  departamentoId: number;
}