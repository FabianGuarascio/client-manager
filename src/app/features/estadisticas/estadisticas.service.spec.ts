import { TestBed } from '@angular/core/testing';
import { EstadisticasService } from './estadisticas.service';

describe('EstadisticasService', () => {
  let service: EstadisticasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstadisticasService);
  });

  it('should compute the average age', () => {
    expect(service.promedioEdad([20, 30, 40])).toBe(30);
  });

  it('should return 0 average for an empty list', () => {
    expect(service.promedioEdad([])).toBe(0);
  });

  it('should compute the sample standard deviation', () => {
    // Edades 2, 4, 4, 4, 5, 5, 7, 9 -> media 5, desvío muestral 2.138...
    const edades = [2, 4, 4, 4, 5, 5, 7, 9];
    expect(service.desviacionEstandarEdad(edades)).toBeCloseTo(2.1381, 3);
  });

  it('should return 0 standard deviation for fewer than 2 ages', () => {
    expect(service.desviacionEstandarEdad([30])).toBe(0);
    expect(service.desviacionEstandarEdad([])).toBe(0);
  });
});
