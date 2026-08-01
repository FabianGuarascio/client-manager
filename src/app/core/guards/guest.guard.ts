import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

/**
 * Bloquea el acceso a rutas de invitado (login/registro) si ya hay sesión
 * activa, redirigiendo a /clientes. Evita que un usuario logueado vea el
 * formulario de login al navegar directamente a /login.
 */
export const guestGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    take(1),
    map((isLoggedIn) => !isLoggedIn || router.createUrlTree(['/clientes'])),
  );
};
