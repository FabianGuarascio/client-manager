import { NgModule } from '@angular/core';
import { FechaFormatoPipe } from './fecha-formato.pipe';
import { CapitalizarPipe } from './capitalizar.pipe';

/** Agrupa los pipes personalizados de la app para reusarlos en cualquier feature module. */
@NgModule({
  declarations: [FechaFormatoPipe, CapitalizarPipe],
  exports: [FechaFormatoPipe, CapitalizarPipe]
})
export class PipesModule {}
