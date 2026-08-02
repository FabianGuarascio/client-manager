import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { ClienteService } from '../../services/cliente.service';
import {
  fechaNoFuturaValidator,
  soloLetrasValidator,
} from '../../validators/cliente.validators';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AsyncPipe, NgIf } from '@angular/common';
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
    AsyncPipe,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteFormComponent {
  // El ErrorStateMatcher default de Material marca un control en error si
  // está inválido O si el form ya fue "submitted" — ese flag lo lleva el
  // FormGroupDirective, no el FormGroup, así que `form.reset()` no lo limpia.
  // Hay que resetear vía la directiva para que los campos vuelvan a verse
  // neutros después de guardar.
  @ViewChild(FormGroupDirective) private formDirective!: FormGroupDirective;

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

  private readonly savingSubject = new BehaviorSubject<boolean>(false);
  readonly saving$ = this.savingSubject.asObservable();

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {
    // Suscripción propia, no un binding de template: con OnPush hay que
    // pedir explícitamente el re-chequeo para que el campo Edad se refleje.
    this.form.get('fechaNacimiento')!.valueChanges.subscribe((value) => {
      const edad = this.calcularEdad(value);
      this.form.get('edad')!.setValue(edad ?? '', { emitEvent: false });
      this.cdr.markForCheck();
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

    this.savingSubject.next(true);
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
        panelClass: 'snackbar-success',
      });
      this.formDirective.resetForm();
    } catch (error) {
      this.snackBar.open('No se pudo registrar el cliente. Intentá de nuevo.', 'Cerrar', {
        duration: 4000,
        panelClass: 'snackbar-error',
      });
    } finally {
      this.savingSubject.next(false);
    }
  }
}
