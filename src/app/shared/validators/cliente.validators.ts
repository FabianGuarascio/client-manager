import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Solo letras (con acentos/ñ) y espacios — rechaza números y símbolos en nombre/apellido. */
export const soloLetrasValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value as string;
  if (!value) {
    return null;
  }
  return /^[a-zA-ZÀ-ÿñÑ\s]+$/.test(value.trim()) ? null : { soloLetras: true };
};

/** Rechaza fechas futuras (nadie puede haber nacido después de hoy). */
export const fechaNoFuturaValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
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
    (hoy.getMonth() === fechaNacimiento.getMonth() && hoy.getDate() < fechaNacimiento.getDate());
  if (aunNoCumplioEsteAnio) {
    edad--;
  }
  return edad;
}

/**
 * Validador de grupo: la edad ingresada debe coincidir con la que resulta
 * de calcular años cumplidos desde `fechaNacimiento` hasta hoy. Evita datos
 * inconsistentes entre los dos campos (ej: fecha de nacimiento de 1990 con
 * edad "10").
 */
export const edadCoherenteConFechaValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const edad = group.get('edad')?.value;
  const fechaNacimiento = group.get('fechaNacimiento')?.value;

  if (edad == null || edad === '' || !fechaNacimiento) {
    return null;
  }

  const fecha = fechaNacimiento instanceof Date ? fechaNacimiento : new Date(fechaNacimiento);
  if (isNaN(fecha.getTime())) {
    return null;
  }

  const edadCalculada = calcularEdad(fecha);
  return edadCalculada === Number(edad) ? null : { edadInconsistente: true };
};
