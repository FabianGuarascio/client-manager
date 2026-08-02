import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ClienteListComponent } from './cliente-list.component';
import { EstadisticasComponent } from '../../../estadisticas/components/estadisticas/estadisticas.component';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../../../models/cliente.model';

describe('ClienteListComponent', () => {
  let component: ClienteListComponent;
  let fixture: ComponentFixture<ClienteListComponent>;
  let clienteServiceMock: { getAll: jasmine.Spy; delete: jasmine.Spy };

  const clientesDeEjemplo: Cliente[] = [
    { id: '1', nombre: 'ana', apellido: 'gomez', edad: 25, fechaNacimiento: '1999-05-01' },
    { id: '2', nombre: 'juan', apellido: 'perez', edad: 40, fechaNacimiento: '1985-02-10' },
  ];

  beforeEach(async () => {
    clienteServiceMock = {
      getAll: jasmine.createSpy('getAll').and.returnValue(of(clientesDeEjemplo)),
      delete: jasmine.createSpy('delete').and.returnValue(Promise.resolve()),
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        ClienteListComponent,
        EstadisticasComponent,
      ],
      providers: [{ provide: ClienteService, useValue: clienteServiceMock }],
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

  describe('eliminar', () => {
    // El componente resuelve MatDialog/MatSnackBar desde su propio injector
    // standalone (importa MatDialogModule/MatSnackBarModule en `imports`),
    // que es una instancia distinta de la que devolvería un provider
    // sobreescrito en el TestBed a nivel raíz — hay que espiar la instancia
    // que el propio componente usa (mismo criterio que el spec de
    // ClienteFormComponent con MatSnackBar). Además, `delete()` resuelve
    // una promesa de forma asíncrona: sin fakeAsync + flushMicrotasks esa
    // promesa termina de resolver después de que el test (y su fixture) ya
    // se destruyeron, y el snackbar real intenta abrirse contra un injector
    // muerto (NG0205).
    let openSnackBarSpy: jasmine.Spy;

    beforeEach(() => {
      openSnackBarSpy = spyOn((component as any).snackBar as MatSnackBar, 'open');
    });

    function mockDialogResult(confirmado: boolean): void {
      spyOn((component as any).dialog as MatDialog, 'open').and.returnValue({
        afterClosed: () => of(confirmado),
      } as any);
    }

    it('should not delete when the dialog is dismissed without confirming', fakeAsync(() => {
      mockDialogResult(false);

      component.eliminar(clientesDeEjemplo[0]);
      flushMicrotasks();

      expect(clienteServiceMock.delete).not.toHaveBeenCalled();
    }));

    it('should delete the cliente when the dialog is confirmed', fakeAsync(() => {
      mockDialogResult(true);

      component.eliminar(clientesDeEjemplo[0]);
      flushMicrotasks();

      expect(clienteServiceMock.delete).toHaveBeenCalledWith('1');
    }));

    it('should mark the id as eliminando while the delete request is pending', fakeAsync(() => {
      let resolverDelete!: () => void;
      clienteServiceMock.delete.and.returnValue(
        new Promise<void>((resolve) => {
          resolverDelete = resolve;
        }),
      );
      mockDialogResult(true);

      component.eliminar(clientesDeEjemplo[0]);

      expect(component.eliminandoIds.has('1')).toBeTrue();

      resolverDelete();
      flushMicrotasks();

      expect(component.eliminandoIds.has('1')).toBeFalse();
    }));

    it('should keep the row in the table until the backend confirms the delete', fakeAsync(() => {
      let resolverDelete!: () => void;
      clienteServiceMock.delete.and.returnValue(
        new Promise<void>((resolve) => {
          resolverDelete = resolve;
        }),
      );
      mockDialogResult(true);

      component.eliminar(clientesDeEjemplo[0]);

      // Simula que Firestore ya actualizó la lista de forma optimista (el
      // doc ya no viene en la próxima emisión de getAll()) antes de que la
      // promesa de delete() se resuelva.
      (component as any).clientes = clientesDeEjemplo.filter((c) => c.id !== '1');
      (component as any).actualizarVista();

      expect(component.dataSource.data.some((c) => c.id === '1')).toBeTrue();

      resolverDelete();
      flushMicrotasks();

      expect(component.dataSource.data.some((c) => c.id === '1')).toBeFalse();
    }));

    it('should show a success snackbar after deleting', fakeAsync(() => {
      mockDialogResult(true);

      component.eliminar(clientesDeEjemplo[0]);
      flushMicrotasks();

      expect(openSnackBarSpy).toHaveBeenCalledWith(
        'Cliente eliminado.',
        'Cerrar',
        jasmine.objectContaining({ panelClass: 'snackbar-success' }),
      );
    }));

    it('should show an error snackbar when the delete fails', fakeAsync(() => {
      clienteServiceMock.delete.and.returnValue(Promise.reject('boom'));
      mockDialogResult(true);

      component.eliminar(clientesDeEjemplo[0]);
      flushMicrotasks();

      expect(openSnackBarSpy).toHaveBeenCalledWith(
        'No se pudo eliminar el cliente. Intentá de nuevo.',
        'Cerrar',
        jasmine.objectContaining({ panelClass: 'snackbar-error' }),
      );
    }));
  });
});
