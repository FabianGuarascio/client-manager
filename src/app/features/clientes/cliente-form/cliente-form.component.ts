import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClienteService } from '../cliente.service';
import {
  fechaNoFuturaValidator,
  soloLetrasValidator,
} from '../../../shared/validators/cliente.validators';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
})
export class ClienteFormComponent {
  readonly hoy = new Date();

  readonly form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2), soloLetrasValidator]],
    apellido: ['', [Validators.required, Validators.minLength(2), soloLetrasValidator]],
    edad: [
      { value: '', disabled: true },
      [Validators.required, Validators.min(0), Validators.max(120)],
    ],
    fechaNacimiento: ['', [Validators.required, fechaNoFuturaValidator]],
  });

  saving = false;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar,
  ) {
    this.form.get('fechaNacimiento')!.valueChanges.subscribe((value) => {
      const edad = this.calcularEdad(value);
      this.form.get('edad')!.setValue(edad ?? '', { emitEvent: false });
    });
  }

  /**
   * Calcula la edad en años cumplidos a partir de la fecha de nacimiento,
   * restando 1 si todavía no pasó el cumpleaños de este año.
   */
  private calcularEdad(fechaNacimiento: unknown): number | null {
    const fecha =
      fechaNacimiento instanceof Date ? fechaNacimiento : new Date(fechaNacimiento as string);

    if (!fechaNacimiento || isNaN(fecha.getTime()) || fecha > this.hoy) {
      return null;
    }

    let edad = this.hoy.getFullYear() - fecha.getFullYear();
    const noCumplioAun =
      this.hoy.getMonth() < fecha.getMonth() ||
      (this.hoy.getMonth() === fecha.getMonth() && this.hoy.getDate() < fecha.getDate());
    if (noCumplioAun) {
      edad--;
    }

    return edad;
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const { nombre, apellido, fechaNacimiento } = this.form.value;
    const { edad } = this.form.getRawValue();
    const fecha: Date =
      fechaNacimiento instanceof Date ? fechaNacimiento : new Date(fechaNacimiento);

    try {
      await this.clienteService.create({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        edad: Number(edad),
        fechaNacimiento: fecha.toISOString(),
      });
      this.snackBar.open('Cliente registrado con éxito.', 'Cerrar', {
        duration: 3000,
      });
      this.form.reset();
    } catch (error) {
      this.snackBar.open('No se pudo registrar el cliente. Intentá de nuevo.', 'Cerrar', {
        duration: 4000,
      });
    } finally {
      this.saving = false;
    }
  }
}
