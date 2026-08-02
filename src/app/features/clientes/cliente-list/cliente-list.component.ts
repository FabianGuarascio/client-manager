import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../cliente.service';
import { CapitalizarPipe } from '../../../pipes/capitalizar.pipe';
import { FechaFormatoPipe } from '../../../pipes/fecha-formato.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { EstadisticasComponent } from '../../estadisticas/estadisticas/estadisticas.component';

/**
 * Listado de clientes con filtro por texto, orden por columna y paginación.
 * También muestra las estadísticas (promedio/desvío) de la lista completa
 * (sin aplicar el filtro de texto, para que reflejen a todos los
 * registrados y no solo la vista filtrada).
 */
@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.scss'],
  standalone: true,
  imports: [
    EstadisticasComponent,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    NgIf,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FechaFormatoPipe,
    CapitalizarPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteListComponent implements OnDestroy {
  readonly columnas = ['nombre', 'apellido', 'edad', 'fechaNacimiento'];
  readonly dataSource = new MatTableDataSource<Cliente>([]);

  clientes: Cliente[] = [];
  cargando = true;

  // La tabla vive detrás de *ngIf="!cargando", así que MatSort/MatPaginator
  // no existen todavía cuando corre ngAfterViewInit (el spinner se muestra
  // primero). Con setters se conectan apenas Angular los crea, sea cuando sea.
  @ViewChild(MatSort) set sort(sort: MatSort) {
    if (sort) {
      this.dataSource.sort = sort;
    }
  }

  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  }

  private readonly subscription: Subscription;
  private readonly fechaFormatoPipe = new FechaFormatoPipe();

  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef,
  ) {
    // Filtro explícito por nombre/apellido/edad/fecha en vez del default de
    // MatTableDataSource (que concatena TODOS los campos del objeto,
    // incluido el id). La fecha se compara ya formateada ("15 de marzo de
    // 1990"), igual que se ve en la tabla — si no, buscar por el mes en
    // texto no encontraba nada porque el dato crudo es un ISO string.
    this.dataSource.filterPredicate = (cliente, filtro) => {
      const campos = [
        cliente.nombre,
        cliente.apellido,
        String(cliente.edad),
        this.fechaFormatoPipe.transform(cliente.fechaNacimiento),
      ];
      return campos.some((campo) => campo.toLowerCase().includes(filtro));
    };

    // El listener de Firestore no dispara dentro de ningún evento de esta
    // vista, así que con OnPush hace falta marcar la vista para que se
    // refleje (spinner -> tabla, filas nuevas).
    this.subscription = this.clienteService.getAll().subscribe((clientes) => {
      this.clientes = clientes;
      this.dataSource.data = clientes;
      this.cargando = false;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  aplicarFiltro(texto: string): void {
    this.dataSource.filter = texto.trim().toLowerCase();
  }
}
