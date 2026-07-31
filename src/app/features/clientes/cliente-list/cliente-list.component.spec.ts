import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { ClienteListComponent } from './cliente-list.component';
import { EstadisticasComponent } from '../../estadisticas/estadisticas/estadisticas.component';
import { ClienteService } from '../cliente.service';
import { SharedMaterialModule } from '../../../shared/material.module';
import { PipesModule } from '../../../pipes/pipes.module';
import { Cliente } from '../../../models/cliente.model';

describe('ClienteListComponent', () => {
  let component: ClienteListComponent;
  let fixture: ComponentFixture<ClienteListComponent>;

  const clientesDeEjemplo: Cliente[] = [
    { id: '1', nombre: 'ana', apellido: 'gomez', edad: 25, fechaNacimiento: '1999-05-01' },
    { id: '2', nombre: 'juan', apellido: 'perez', edad: 40, fechaNacimiento: '1985-02-10' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedMaterialModule, PipesModule, NoopAnimationsModule],
      declarations: [ClienteListComponent, EstadisticasComponent],
      providers: [{ provide: ClienteService, useValue: { getAll: () => of(clientesDeEjemplo) } }]
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load clients from the service into the table', () => {
    expect(component.clientes.length).toBe(2);
    expect(component.dataSource.data.length).toBe(2);
  });

  it('should filter the data source by text', () => {
    component.aplicarFiltro('ana');
    expect(component.dataSource.filter).toBe('ana');
  });
});
