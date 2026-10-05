import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { formatCurrency, getNumberOfCurrencyDigits } from '@angular/common';
import { form, required, FormField } from '@angular/forms/signals';
import { GetDepartamentoResponse } from '../../interfaces/departamento-dtos';
import { DepartamentoService } from '../../Services/departamento-service';
import { EmpleadoService } from '../../Services/empleado-service';
import { CreateEmpleadoRequest, UpdateEmpleadoRequest } from '../../interfaces/empleado-dtos';
@Component({
  selector: 'app-empleado-add-edit',
  imports: [
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    FormField,
  ],
  templateUrl: './empleado-add-edit.html',
  styleUrl: './empleado-add-edit.scss',
})
export class EmpleadoAddEdit implements OnInit {
  private initialData = {
    NombreCompleto: '',
    Correo: '',
    Salario: '',
    DepartamentoId: '',
  };

  protected empleadoModel = signal(this.initialData);
  protected empleadoForm = form(this.empleadoModel, (field) => {
    required(field.NombreCompleto);
    required(field.Correo);
    required(field.Salario);
    required(field.DepartamentoId);
  });

  protected selectedFile = signal<File | null>(null);
  protected departamentos = signal<GetDepartamentoResponse[]>([]);
  protected departamentoService = inject(DepartamentoService);
  protected empleadoService = inject(EmpleadoService);
  protected dialogRef = inject(MatDialogRef<EmpleadoAddEdit>);
  protected data = inject<{ empleadoId?: number }>(MAT_DIALOG_DATA, { optional: true });
  protected isEditMode = signal<boolean>(false);

  ngOnInit(): void {
    this.departamentoService.getAll().subscribe({
      next: (resp) => {
        this.departamentos.set(resp);
        if (this.data?.empleadoId) {
          this.isEditMode.set(true);
          this.empleadoService.getById(this.data.empleadoId).subscribe({
            next: (empleado) => {
              this.empleadoModel.set({
                NombreCompleto: empleado.nombreCompleto,
                Correo: empleado.correo,
                Salario: empleado.salario.toString(),
                DepartamentoId: empleado.departamentoId.toString(),
              });
            },
            error: (e) => console.log(e.error),
          });
        }
      },
      error: (e) => console.log(e.error),
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  guardar(): void {
    const { NombreCompleto, Correo, Salario, DepartamentoId } = this.empleadoForm().value();

    if (this.isEditMode()) {
      const req: UpdateEmpleadoRequest = {
        id: this.data!.empleadoId!,
        nombreCompleto: NombreCompleto,
        correo: Correo,
        salario: Number(Salario),
        departamentoID: Number(DepartamentoId),
      };
      if (this.selectedFile()) req.imagen = this.selectedFile()!;
      this.empleadoService.actualizar(req).subscribe({
        next: (resp) => this.dialogRef.close(true),
        error: (e) => console.log(e.error),
      });
    } else {
      const req: CreateEmpleadoRequest = {
        nombreCompleto: NombreCompleto,
        correo: Correo,
        salario: Number(Salario),
        departamentoID: Number(DepartamentoId),
      };
      if (this.selectedFile()) req.imagen = this.selectedFile()!;
      this.empleadoService.create(req).subscribe({
        next: (resp) => this.dialogRef.close(true),
        error: (e) => console.log(e.error),
      });
    }
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
