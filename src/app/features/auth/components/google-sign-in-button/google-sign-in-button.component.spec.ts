import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { GoogleSignInButtonComponent } from './google-sign-in-button.component';

describe('GoogleSignInButtonComponent', () => {
  let component: GoogleSignInButtonComponent;
  let fixture: ComponentFixture<GoogleSignInButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoogleSignInButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GoogleSignInButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit signIn on click', () => {
    const signInSpy = jasmine.createSpy('signIn');
    component.signIn.subscribe(signInSpy);

    fixture.debugElement.query(By.css('button')).nativeElement.click();

    expect(signInSpy).toHaveBeenCalled();
  });

  it('should disable the button when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();

    // MatButton refleja `disabled` como atributo HTML (`[attr.disabled]`),
    // no como la propiedad DOM `disabled` directamente.
    const button = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
    expect(button.hasAttribute('disabled')).toBeTrue();
  });
});
