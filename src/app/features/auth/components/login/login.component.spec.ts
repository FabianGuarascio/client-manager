import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/auth/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: { login: jasmine.Spy; loginWithGoogle: jasmine.Spy };

  beforeEach(async () => {
    authService = {
      login: jasmine.createSpy('login').and.resolveTo(),
      loginWithGoogle: jasmine.createSpy('loginWithGoogle').and.resolveTo(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, NoopAnimationsModule, LoginComponent],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when empty', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should require a valid email format', () => {
    component.form.controls['email'].setValue('not-an-email');
    expect(component.form.controls['email'].hasError('email')).toBeTrue();
  });

  it('should sign in with Google and navigate to /clientes', async () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigateByUrl');

    await component.continueWithGoogle();

    expect(authService.loginWithGoogle).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('/clientes');
  });
});
