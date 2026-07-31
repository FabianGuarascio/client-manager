import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClienteFormComponent } from './cliente-form.component';
import { ClienteService } from '../cliente.service';
import { SharedMaterialModule } from '../../../shared/material.module';
import { calcularEdad } from '../../../shared/validators/cliente.validators';

describe('ClienteFormComponent', () => {
  let component: ClienteFormComponent;
  let fixture: ComponentFixture<ClienteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SharedMaterialModule, NoopAnimationsModule],
      declarations: [ClienteFormComponent],
      providers: [{ provide: ClienteService, useValue: { create: () => Promise.resolve() } }]
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
});
