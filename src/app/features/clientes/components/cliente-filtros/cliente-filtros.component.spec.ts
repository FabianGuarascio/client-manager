import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClienteFiltrosComponent } from './cliente-filtros.component';
import { FiltroClientes } from '../../../../models/filtro-clientes.model';

describe('ClienteFiltrosComponent', () => {
  let component: ClienteFiltrosComponent;
  let fixture: ComponentFixture<ClienteFiltrosComponent>;
  let ultimoFiltro: FiltroClientes | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ClienteFiltrosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteFiltrosComponent);
    component = fixture.componentInstance;
    ultimoFiltro = undefined;
    component.filtroCambio.subscribe((filtro) => (ultimoFiltro = filtro));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the trimmed, lowercased text on aplicarTexto', () => {
    component.aplicarTexto('  ANA  ');
    expect(ultimoFiltro).toEqual({ texto: 'ana', edadDesde: null, edadHasta: null });
  });

  it('should emit the parsed edadDesde on aplicarEdadDesde', () => {
    component.aplicarEdadDesde('20');
    expect(ultimoFiltro).toEqual({ texto: '', edadDesde: 20, edadHasta: null });
  });

  it('should emit the parsed edadHasta on aplicarEdadHasta', () => {
    component.aplicarEdadHasta('30');
    expect(ultimoFiltro).toEqual({ texto: '', edadDesde: null, edadHasta: 30 });
  });

  it('should combine texto, edadDesde and edadHasta in a single emission', () => {
    component.aplicarTexto('ana');
    component.aplicarEdadDesde('20');
    component.aplicarEdadHasta('30');
    expect(ultimoFiltro).toEqual({ texto: 'ana', edadDesde: 20, edadHasta: 30 });
  });

  it('should reset edadDesde to null when the input is emptied', () => {
    component.aplicarEdadDesde('20');
    component.aplicarEdadDesde('');
    expect(ultimoFiltro).toEqual({ texto: '', edadDesde: null, edadHasta: null });
  });
});
