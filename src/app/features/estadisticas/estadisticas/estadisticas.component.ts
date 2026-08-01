import { Component, Input, OnChanges } from '@angular/core';
import { Cliente } from '../../../models/cliente.model';
import { EstadisticasService } from '../estadisticas.service';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

/**
 * Muestra promedio y desvío estándar de las edades de la lista de clientes
 * recibida por @Input. Se recalcula cada vez que cambia esa lista.
 */
@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss'],
  standalone: true,
  imports: [MatCardModule, DecimalPipe],
})
export class EstadisticasComponent implements OnChanges {
  @Input() clientes: Cliente[] = [];

  promedio = 0;
  desviacionEstandar = 0;

  constructor(private estadisticasService: EstadisticasService) {}

  ngOnChanges(): void {
    const edades = this.clientes.map((cliente) => cliente.edad);
    this.promedio = this.estadisticasService.promedioEdad(edades);
    this.desviacionEstandar = this.estadisticasService.desviacionEstandarEdad(edades);
  }
}
