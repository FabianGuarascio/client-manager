import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/auth/auth.service';
import { SharedMaterialModule } from '../../../shared/material.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, SharedMaterialModule, NoopAnimationsModule],
      declarations: [LoginComponent],
      providers: [{ provide: AuthService, useValue: { login: () => Promise.resolve() } }]
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
});
