import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formatea una fecha (ISO string, Date, o timestamp) como
 * "15 de marzo de 1990" en español.
 *
 * @example {{ cliente.fechaNacimiento | fechaFormato }}
 */
@Pipe({
  name: 'fechaFormato',
  standalone: true,
})
export class FechaFormatoPipe implements PipeTransform {
  private readonly formatter = new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }

    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) {
      return '';
    }

    return this.formatter.format(date);
  }
}
