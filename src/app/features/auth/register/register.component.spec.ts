import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/auth/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, NoopAnimationsModule, RegisterComponent],
      providers: [{ provide: AuthService, useValue: { register: () => Promise.resolve() } }],
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
});
