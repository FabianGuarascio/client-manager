import { Injectable } from '@angular/core';

/**
 * Cálculos estadísticos puros sobre edades. Se usa desviación estándar
 * muestral (dividiendo por n-1) porque los clientes registrados son una
 * muestra de la población total de clientes posibles, no la población
 * completa.
 */
@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  promedioEdad(edades: number[]): number {
    if (edades.length === 0) {
      return 0;
    }
    return edades.reduce((suma, edad) => suma + edad, 0) / edades.length;
  }

  desviacionEstandarEdad(edades: number[]): number {
    if (edades.length < 2) {
      return 0;
    }
    const promedio = this.promedioEdad(edades);
    const sumaDiferenciasCuadradas = edades.reduce(
      (suma, edad) => suma + Math.pow(edad - promedio, 2),
      0,
    );
    return Math.sqrt(sumaDiferenciasCuadradas / (edades.length - 1));
  }
}
