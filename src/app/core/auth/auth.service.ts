import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/compat/app';

/**
 * Envuelve AngularFireAuth para exponer un contrato simple de
 * login/registro/logout y el estado de sesión como observables.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Emite el usuario autenticado, o null si no hay sesión. */
  readonly user$: Observable<firebase.User | null> = this.afAuth.authState;

  /** Emite true/false según haya sesión activa. Usado por AuthGuard. */
  readonly isLoggedIn$: Observable<boolean> = this.user$.pipe(map((user) => !!user));

  constructor(private afAuth: AngularFireAuth) {}

  async login(email: string, password: string): Promise<void> {
    await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async register(email: string, password: string): Promise<void> {
    await this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  /** Login/registro con Google vía popup — si el usuario no existe, Firebase lo crea. */
  async loginWithGoogle(): Promise<void> {
    await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  async logout(): Promise<void> {
    await this.afAuth.signOut();
  }
}
