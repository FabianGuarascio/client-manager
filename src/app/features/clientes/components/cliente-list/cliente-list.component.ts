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
import { Cliente } from '../../../../models/cliente.model';
import { FiltroClientes } from '../../../../models/filtro-clientes.model';
import { ClienteService } from '../../services/cliente.service';
import { CapitalizarPipe } from '../../../../pipes/capitalizar.pipe';
import { FechaFormatoPipe } from '../../../../pipes/fecha-formato.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EstadisticasComponent } from '../../../estadisticas/components/estadisticas/estadisticas.component';
import { ConfirmarEliminarDialogComponent } from '../confirmar-eliminar-dialog/confirmar-eliminar-dialog.component';
import { ClienteFiltrosComponent } from '../cliente-filtros/cliente-filtros.component';

/**
 * Listado de clientes con filtro por texto, por rango de edad, orden por
 * columna y paginación. También muestra las estadísticas (promedio/desvío)
 * de la lista completa (sin aplicar los filtros, para que reflejen a todos
 * los registrados y no solo la vista filtrada).
 */
@Component({
  selector: 'app-cliente-list',
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.scss'],
  standalone: true,
  imports: [
    EstadisticasComponent,
    ClienteFiltrosComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    NgIf,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    FechaFormatoPipe,
    CapitalizarPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteListComponent implements OnDestroy {
  readonly columnas = ['nombre', 'apellido', 'edad', 'fechaNacimiento', 'acciones'];
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

  // Ids en proceso de borrado: mientras esperan la confirmación del backend,
  // se les muestra un spinner en la fila en vez del ícono de basura.
  readonly eliminandoIds = new Set<string>();

  // Firestore aplica los writes de forma optimista: el listener de getAll()
  // ya refleja el borrado (la fila desaparece de `clientes`) antes de que
  // se resuelva la promesa de `delete()`. Para que la fila solo desaparezca
  // de la tabla cuando el backend confirmó el borrado (no antes), se
  // "congela" acá mientras está en `eliminandoIds`, aunque el listener ya
  // haya dejado de emitirla — si el borrado termina fallando, Firestore
  // revierte el cambio local y la fila vuelve a `clientes` sola.
  private readonly clientesCongelados = new Map<string, Cliente>();

  private readonly subscription: Subscription;
  private readonly fechaFormatoPipe = new FechaFormatoPipe();

  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    // Filtro explícito por nombre/apellido/edad/fecha (en vez del default
    // de MatTableDataSource, que concatena TODOS los campos del objeto,
    // incluido el id) combinado con el rango de edad. La fecha se compara
    // ya formateada ("15 de marzo de 1990"), igual que se ve en la tabla —
    // si no, buscar por el mes en texto no encontraba nada porque el dato
    // crudo es un ISO string.
    this.dataSource.filterPredicate = (cliente, filtroJson) => {
      const { texto, edadDesde, edadHasta } = JSON.parse(filtroJson) as FiltroClientes;

      const coincideTexto =
        !texto ||
        [
          cliente.nombre,
          cliente.apellido,
          String(cliente.edad),
          this.fechaFormatoPipe.transform(cliente.fechaNacimiento),
        ].some((campo) => campo.toLowerCase().includes(texto));

      const coincideEdad =
        (edadDesde == null || cliente.edad >= edadDesde) &&
        (edadHasta == null || cliente.edad <= edadHasta);

      return coincideTexto && coincideEdad;
    };

    // El listener de Firestore no dispara dentro de ningún evento de esta
    // vista, así que con OnPush hace falta marcar la vista para que se
    // refleje (spinner -> tabla, filas nuevas).
    this.subscription = this.clienteService.getAll().subscribe((clientes) => {
      this.clientes = clientes;
      this.actualizarVista();
      this.cargando = false;
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  aplicarFiltro(filtro: FiltroClientes): void {
    this.dataSource.filter = JSON.stringify(filtro);
  }

  /** Combina la lista real de Firestore con las filas congeladas en medio de un borrado. */
  private actualizarVista(): void {
    const idsPresentes = new Set(this.clientes.map((cliente) => cliente.id));
    const filasCongeladas = [...this.clientesCongelados.values()].filter(
      (cliente) => !idsPresentes.has(cliente.id),
    );
    this.dataSource.data = [...this.clientes, ...filasCongeladas];
  }

  eliminar(cliente: Cliente): void {
    const dialogRef = this.dialog.open(ConfirmarEliminarDialogComponent, {
      data: { nombre: cliente.nombre, apellido: cliente.apellido },
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (!confirmado) {
        return;
      }

      const id = cliente.id!;
      this.eliminandoIds.add(id);
      this.clientesCongelados.set(id, cliente);
      this.actualizarVista();
      this.cdr.markForCheck();

      this.clienteService
        .delete(id)
        .then(() => {
          this.snackBar.open('Cliente eliminado.', 'Cerrar', {
            duration: 3000,
            panelClass: 'snackbar-success',
          });
        })
        .catch(() => {
          this.snackBar.open('No se pudo eliminar el cliente. Intentá de nuevo.', 'Cerrar', {
            duration: 4000,
            panelClass: 'snackbar-error',
          });
        })
        .finally(() => {
          this.eliminandoIds.delete(id);
          this.clientesCongelados.delete(id);
          this.actualizarVista();
          this.cdr.markForCheck();
        });
    });
  }
}
