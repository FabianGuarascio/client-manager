import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ConfirmarEliminarDialogComponent } from './confirmar-eliminar-dialog.component';

describe('ConfirmarEliminarDialogComponent', () => {
  let component: ConfirmarEliminarDialogComponent;
  let fixture: ComponentFixture<ConfirmarEliminarDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmarEliminarDialogComponent, boolean>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ConfirmarEliminarDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { nombre: 'Juan', apellido: 'Perez' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmarEliminarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the full name of the cliente to delete', () => {
    const content = fixture.debugElement.query(By.css('mat-dialog-content')).nativeElement
      .textContent as string;
    expect(content).toContain('Juan');
    expect(content).toContain('Perez');
  });

  it('should close with false on cancelar', () => {
    component.cancelar();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
  });

  it('should close with true on confirmar', () => {
    component.confirmar();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});
