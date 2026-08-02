import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { ClienteListComponent } from './cliente-list.component';
import { EstadisticasComponent } from '../../../estadisticas/components/estadisticas/estadisticas.component';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../../../models/cliente.model';

describe('ClienteListComponent', () => {
  let component: ClienteListComponent;
  let fixture: ComponentFixture<ClienteListComponent>;

  const clientesDeEjemplo: Cliente[] = [
    { id: '1', nombre: 'ana', apellido: 'gomez', edad: 25, fechaNacimiento: '1999-05-01' },
    { id: '2', nombre: 'juan', apellido: 'perez', edad: 40, fechaNacimiento: '1985-02-10' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        ClienteListComponent,
        EstadisticasComponent,
      ],
      providers: [{ provide: ClienteService, useValue: { getAll: () => of(clientesDeEjemplo) } }],
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

  it('should filter by nombre', () => {
    component.aplicarFiltro('ana');
    expect(component.dataSource.filteredData.map((c) => c.id)).toEqual(['1']);
  });

  it('should filter by apellido', () => {
    component.aplicarFiltro('perez');
    expect(component.dataSource.filteredData.map((c) => c.id)).toEqual(['2']);
  });

  it('should filter by edad', () => {
    component.aplicarFiltro('40');
    expect(component.dataSource.filteredData.map((c) => c.id)).toEqual(['2']);
  });

  it('should filter by fecha de nacimiento using the same formatting shown in the table', () => {
    // '1999-05-01' se muestra como "1 de mayo de 1999" — el filtro debe
    // matchear contra ese texto formateado, no contra el ISO string crudo.
    component.aplicarFiltro('mayo');
    expect(component.dataSource.filteredData.map((c) => c.id)).toEqual(['1']);
  });

  it('should return no rows when nothing matches', () => {
    component.aplicarFiltro('inexistente');
    expect(component.dataSource.filteredData.length).toBe(0);
  });
});
