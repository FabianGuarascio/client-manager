import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ClienteFormComponent } from './cliente-form.component';
import { ClienteService } from '../cliente.service';
import { calcularEdad } from '../../../shared/validators/cliente.validators';

function completarFormularioValido(component: ClienteFormComponent): void {
  component.form.controls['nombre'].setValue('Juan');
  component.form.controls['apellido'].setValue('Perez');
  component.form.controls['fechaNacimiento'].setValue(new Date(1990, 0, 1));
}

describe('ClienteFormComponent', () => {
  let component: ClienteFormComponent;
  let fixture: ComponentFixture<ClienteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        ClienteFormComponent,
      ],
      providers: [{ provide: ClienteService, useValue: { create: () => Promise.resolve() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reject a name with numbers', () => {
    component.form.controls['nombre'].setValue('Juan123');
    expect(component.form.controls['nombre'].hasError('soloLetras')).toBeTrue();
  });

  it('should flag an age that does not match the birth date', () => {
    const fechaNacimiento = new Date(1990, 0, 1);
    component.form.controls['fechaNacimiento'].setValue(fechaNacimiento);
    component.form.controls['edad'].setValue(5);
    expect(component.form.hasError('edadInconsistente')).toBeTrue();
  });

  it('should accept an age that matches the birth date', () => {
    const fechaNacimiento = new Date(1990, 0, 1);
    component.form.controls['fechaNacimiento'].setValue(fechaNacimiento);
    component.form.controls['edad'].setValue(calcularEdad(fechaNacimiento));
    expect(component.form.hasError('edadInconsistente')).toBeFalse();
  });

  it('should reject a future birth date', () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    component.form.controls['fechaNacimiento'].setValue(future);
    expect(component.form.controls['fechaNacimiento'].hasError('fechaFutura')).toBeTrue();
  });

  it('should not show validation errors right after a successful submit resets the form', async () => {
    completarFormularioValido(component);
    fixture.detectChanges();

    await component.submit();
    fixture.detectChanges();

    // Regresión: form.reset() por sí solo no limpia el flag "submitted" del
    // FormGroupDirective, y el ErrorStateMatcher default de Material lo usa
    // para decidir si pintar un control como inválido — con el form recién
    // reseteado (campos requeridos vacíos) eso mostraba error apenas guardar.
    const errores = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(errores.length).toBe(0);
  });

  it('should show a success-styled snackbar after saving', async () => {
    // El componente resuelve MatSnackBar desde el injector propio del
    // componente standalone (importa MatSnackBarModule en su `imports`), que
    // es una instancia distinta de la que devuelve TestBed.inject a nivel
    // raíz — hay que espiar la instancia que el propio componente usa.
    const openSpy = spyOn((component as any).snackBar as MatSnackBar, 'open').and.callThrough();

    completarFormularioValido(component);
    await component.submit();

    expect(openSpy).toHaveBeenCalledWith(
      'Cliente registrado con éxito.',
      'Cerrar',
      jasmine.objectContaining({ panelClass: 'snackbar-success' }),
    );
  });
});
