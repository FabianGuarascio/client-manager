import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Router } from '@angular/router';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/auth/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: { register: jasmine.Spy; loginWithGoogle: jasmine.Spy };

  beforeEach(async () => {
    authService = {
      register: jasmine.createSpy('register').and.resolveTo(),
      loginWithGoogle: jasmine.createSpy('loginWithGoogle').and.resolveTo(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, NoopAnimationsModule, RegisterComponent],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should flag mismatched passwords', () => {
    component.form.controls['password'].setValue('password123');
    component.form.controls['confirmPassword'].setValue('different');
    expect(component.form.hasError('passwordsMismatch')).toBeTrue();
  });

  it('should accept matching passwords', () => {
    component.form.controls['password'].setValue('password123');
    component.form.controls['confirmPassword'].setValue('password123');
    expect(component.form.hasError('passwordsMismatch')).toBeFalse();
  });

  it('should sign in with Google and navigate to /clientes', async () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigateByUrl');

    await component.continueWithGoogle();

    expect(authService.loginWithGoogle).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('/clientes');
  });
});
