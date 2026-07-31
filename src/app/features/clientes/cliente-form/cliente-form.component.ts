import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClienteService } from '../cliente.service';
import {
  edadCoherenteConFechaValidator,
  fechaNoFuturaValidator,
  soloLetrasValidator
} from '../../../shared/validators/cliente.validators';

/**
 * Alta de un nuevo cliente. La edad y la fecha de nacimiento se validan de
 * forma cruzada (edadCoherenteConFechaValidator) para evitar datos
 * contradictorios entre ambos campos.
 */
@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss']
})
export class ClienteFormComponent {
  readonly hoy = new Date();

  readonly form: FormGroup = this.fb.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(2), soloLetrasValidator]],
      apellido: ['', [Validators.required, Validators.minLength(2), soloLetrasValidator]],
      edad: ['', [Validators.required, Validators.min(0), Validators.max(120)]],
      fechaNacimiento: ['', [Validators.required, fechaNoFuturaValidator]]
    },
    { validators: edadCoherenteConFechaValidator }
  );

  saving = false;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private snackBar: MatSnackBar
  ) {}

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const { nombre, apellido, edad, fechaNacimiento } = this.form.value;
    const fecha: Date = fechaNacimiento instanceof Date ? fechaNacimiento : new Date(fechaNacimiento);

    try {
      await this.clienteService.create({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        edad: Number(edad),
        fechaNacimiento: fecha.toISOString()
      });
      this.snackBar.open('Cliente registrado con éxito.', 'Cerrar', { duration: 3000 });
      this.form.reset();
    } catch (error) {
      this.snackBar.open('No se pudo registrar el cliente. Intentá de nuevo.', 'Cerrar', { duration: 4000 });
    } finally {
      this.saving = false;
    }
  }
}
