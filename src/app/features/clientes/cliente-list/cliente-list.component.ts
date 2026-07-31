import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../cliente.service';

/**
 * Listado de clientes con filtro por texto, orden por columna y paginación.
 * También muestra las estadísticas (promedio/desvío) de la lista completa
 * (sin aplicar el filtro de texto, para que reflejen a todos los
 * registrados y no solo la vista filtrada).
 */
@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.scss']
})
export class ClienteListComponent implements AfterViewInit, OnDestroy {
  readonly columnas = ['nombre', 'apellido', 'edad', 'fechaNacimiento'];
  readonly dataSource = new MatTableDataSource<Cliente>([]);

  clientes: Cliente[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private readonly subscription: Subscription;

  constructor(private clienteService: ClienteService) {
    this.subscription = this.clienteService.getAll().subscribe((clientes) => {
      this.clientes = clientes;
      this.dataSource.data = clientes;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  aplicarFiltro(texto: string): void {
    this.dataSource.filter = texto.trim().toLowerCase();
  }
}
