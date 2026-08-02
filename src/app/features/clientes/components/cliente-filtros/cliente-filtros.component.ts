import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FiltroClientes } from '../../../../models/filtro-clientes.model';

/**
 * Controles de filtro del listado de clientes: texto libre (nombre,
 * apellido, edad, fecha de nacimiento) y rango de edad. No sabe nada de
 * `MatTableDataSource` ni de cómo se aplica el filtro — solo arma un
 * `FiltroClientes` con lo que el usuario tipeó y lo emite.
 */
@Component({
  selector: 'app-cliente-filtros',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './cliente-filtros.component.html',
  styleUrls: ['./cliente-filtros.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteFiltrosComponent {
  @Output() readonly filtroCambio = new EventEmitter<FiltroClientes>();

  private texto = '';
  private edadDesde: number | null = null;
  private edadHasta: number | null = null;

  aplicarTexto(valor: string): void {
    this.texto = valor.trim().toLowerCase();
    this.emitirFiltro();
  }

  aplicarEdadDesde(valor: string): void {
    this.edadDesde = valor === '' ? null : Number(valor);
    this.emitirFiltro();
  }

  aplicarEdadHasta(valor: string): void {
    this.edadHasta = valor === '' ? null : Number(valor);
    this.emitirFiltro();
  }

  private emitirFiltro(): void {
    this.filtroCambio.emit({
      texto: this.texto,
      edadDesde: this.edadDesde,
      edadHasta: this.edadHasta,
    });
  }
}
