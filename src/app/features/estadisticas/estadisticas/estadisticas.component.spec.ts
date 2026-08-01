import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasComponent } from './estadisticas.component';

describe('EstadisticasComponent', () => {
  let component: EstadisticasComponent;
  let fixture: ComponentFixture<EstadisticasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EstadisticasComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should recompute stats when clientes changes', () => {
    component.clientes = [
      { nombre: 'A', apellido: 'A', edad: 20, fechaNacimiento: '2000-01-01' },
      { nombre: 'B', apellido: 'B', edad: 30, fechaNacimiento: '1990-01-01' },
    ];
    component.ngOnChanges();
    expect(component.promedio).toBe(25);
  });
});
