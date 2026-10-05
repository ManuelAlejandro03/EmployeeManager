import { Component, effect, inject, OnInit, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { EmpleadoAddEdit } from '../empleado-add-edit/empleado-add-edit';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GetEmpleadoResponse } from '../../interfaces/empleado-dtos';
import { EmpleadoService } from '../../Services/empleado-service';
import { CurrencyPipe } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-empleado-list',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    CurrencyPipe,
  ],
  templateUrl: './empleado-list.html',
  styleUrl: './empleado-list.scss',
})
export class EmpleadoList implements OnInit {
  readonly dialog = inject(MatDialog);

  protected displayedColumns: string[] = [
    'image',
    'nombreCompleto',
    'correo',
    'salario',
    'departamento',
    'actions',
  ];
  protected dataSource = new MatTableDataSource<GetEmpleadoResponse>([]);
  protected paginator = viewChild(MatPaginator);
  protected empleados = signal<GetEmpleadoResponse[]>([]);
  protected empleadoServices = inject(EmpleadoService);

  constructor() {
    effect(() => {
      this.dataSource.data = this.empleados();

      if (this.paginator()) {
        this.dataSource.paginator = this.paginator();
      }
    });
  }
  private loadEmployees(): void {
    this.empleadoServices.getAll().subscribe({
      next: (data) => this.empleados.set(data),
      error: (e) => {
        console.log(e.error);
        this.empleados.set([]);
      },
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(EmpleadoAddEdit, {
      width: '450px',
      height: 'auto',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadEmployees();
    });
  }
  openEditModal(id: number): void {
    const dialogRef = this.dialog.open(EmpleadoAddEdit, {
      width: '450px',
      height: 'auto',
      disableClose: true,
      data: { empleadoId: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadEmployees();
    });
  }
  eliminarEmpleado(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.empleadoServices.eliminar(id).subscribe({
          next: () => {
            this.loadEmployees();
            Swal.fire({
              title: '¡Eliminado!',
              text: 'Su archivo ha sido eliminado.',
              icon: 'success',
            });
          },
          error: (e) => console.error(e.error),
        });
      }
    });
  }
}
