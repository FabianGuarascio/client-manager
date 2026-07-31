import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Solo letras (con acentos/ñ) y espacios — rechaza números y símbolos en nombre/apellido. */
export const soloLetrasValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value as string;
  if (!value) {
    return null;
  }
  return /^[a-zA-ZÀ-ÿñÑ\s]+$/.test(value.trim()) ? null : { soloLetras: true };
};

/** Rechaza fechas futuras (nadie puede haber nacido después de hoy). */
export const fechaNoFuturaValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = control.value;
  if (!value) {
    return null;
  }
  const fecha = value instanceof Date ? value : new Date(value);
  return fecha.getTime() > Date.now() ? { fechaFutura: true } : null;
};

/** Calcula la edad en años completos a partir de una fecha de nacimiento. */
export function calcularEdad(fechaNacimiento: Date): number {
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const aunNoCumplioEsteAnio =
    hoy.getMonth() < fechaNacimiento.getMonth() ||
    (hoy.getMonth() === fechaNacimiento.getMonth() &&
      hoy.getDate() < fechaNacimiento.getDate());
  if (aunNoCumplioEsteAnio) {
    edad--;
  }
  return edad;
}
