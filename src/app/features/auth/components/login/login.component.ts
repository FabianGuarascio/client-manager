import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { GoogleSignInButtonComponent } from '../google-sign-in-button/google-sign-in-button.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    AsyncPipe,
    MatButtonModule,
    RouterLink,
    MatSnackBarModule,
    GoogleSignInButtonComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loadingSubject.next(true);
    const { email, password } = this.form.value;

    try {
      await this.authService.login(email, password);
      this.router.navigateByUrl('/clientes');
    } catch (error) {
      this.snackBar.open('Email o contraseña incorrectos.', 'Cerrar', {
        duration: 4000,
      });
    } finally {
      this.loadingSubject.next(false);
    }
  }

  async continueWithGoogle(): Promise<void> {
    this.loadingSubject.next(true);

    try {
      await this.authService.loginWithGoogle();
      this.router.navigateByUrl('/clientes');
    } catch (error) {
      this.snackBar.open('No se pudo iniciar sesión con Google. Intentá de nuevo.', 'Cerrar', {
        duration: 4000,
      });
    } finally {
      this.loadingSubject.next(false);
    }
  }
}
