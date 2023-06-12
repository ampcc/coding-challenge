import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

// Test if Dialog Component works properly
describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        HttpClient,
        MatDialog,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
      imports: [
        DialogComponent,
        HttpClientModule,
        MatDialogModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Check if component can be created
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Check if dialog can be closed
  it('can be closed', fakeAsync(() => {
    const close = spyOn(component, 'closeDialog');

    const button = fixture.debugElement.nativeElement.querySelector('.close');
    button.click();
    tick();

    expect(close).toHaveBeenCalled();

    flush();
  }));
});
