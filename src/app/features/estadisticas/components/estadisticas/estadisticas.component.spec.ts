import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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

  it('should show a skeleton instead of the values while cargando is true', () => {
    component.cargando = true;
    fixture.detectChanges();

    const skeletons = fixture.debugElement.queryAll(By.css('.skeleton'));
    const valores = fixture.debugElement.queryAll(By.css('.stat-value:not(.skeleton)'));
    expect(skeletons.length).toBe(3);
    expect(valores.length).toBe(0);
  });

  it('should show the values instead of the skeleton once cargando is false', () => {
    component.cargando = false;
    fixture.detectChanges();

    const skeletons = fixture.debugElement.queryAll(By.css('.skeleton'));
    const valores = fixture.debugElement.queryAll(By.css('.stat-value:not(.skeleton)'));
    expect(skeletons.length).toBe(0);
    expect(valores.length).toBe(3);
  });
});
