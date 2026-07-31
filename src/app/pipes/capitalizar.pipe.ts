import { Pipe, PipeTransform } from '@angular/core';

/**
 * Capitaliza la primera letra de cada palabra (ej: "juan carlos" ->
 * "Juan Carlos"). Usado para mostrar nombre/apellido de forma consistente
 * sin importar cómo los haya tipeado el usuario en el formulario.
 *
 * @example {{ cliente.nombre | capitalizar }}
 */
@Pipe({ name: 'capitalizar' })
export class CapitalizarPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    return value
      .toLowerCase()
      .split(' ')
      .filter((palabra) => palabra.length > 0)
      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(' ');
  }
}
