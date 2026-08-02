import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmarEliminarDialogData {
  nombre: string;
  apellido: string;
}

/**
 * Diálogo de confirmación antes de borrar un cliente. El borrado en
 * Firestore no tiene deshacer, así que se exige un paso explícito en vez
 * de eliminar directo al tocar el ícono de la fila.
 */
@Component({
  selector: 'app-confirmar-eliminar-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirmar-eliminar-dialog.component.html',
  styleUrls: ['./confirmar-eliminar-dialog.component.scss'],
})
export class ConfirmarEliminarDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmarEliminarDialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) readonly data: ConfirmarEliminarDialogData,
  ) {}

  cancelar(): void {
    this.dialogRef.close(false);
  }

  confirmar(): void {
    this.dialogRef.close(true);
  }
}
