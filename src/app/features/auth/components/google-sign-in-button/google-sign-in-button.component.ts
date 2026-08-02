import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

/**
 * Botón "Continuar con Google", puramente presentacional: el flujo de auth
 * (loading, error, navegación) lo maneja quien lo usa, vía el evento `signIn`.
 * Compartido entre LoginComponent y RegisterComponent.
 *
 * Sin OnPush a propósito: es un componente hoja trivial (sin cómputo caro)
 * y el binding de `disabled` desde el padre (`loading$ | async`) ya alcanza
 * para que se actualice — no vale la pena la fricción extra de gestionar
 * markForCheck acá.
 */
@Component({
  selector: 'app-google-sign-in-button',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './google-sign-in-button.component.html',
  styleUrls: ['./google-sign-in-button.component.scss'],
})
export class GoogleSignInButtonComponent {
  @Input() disabled = false;
  @Output() signIn = new EventEmitter<void>();
}
