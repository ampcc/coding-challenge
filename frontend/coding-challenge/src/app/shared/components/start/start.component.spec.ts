import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { StartComponent } from './start.component';
import { HttpClient, HttpClientModule, HttpXhrBackend } from '@angular/common/http';
import { MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

// Test if Start Component works properly
describe('StartComponent', () => {
  let component: StartComponent;
  let fixture: ComponentFixture<StartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        HttpClient,
        MatDialog,
        HttpXhrBackend
      ],
      imports: [
        StartComponent,
        HttpClientModule,
        MatDialogModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Check if component can be created
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Check if dialog can be opened
  it('can open dialog', () => {
    spyOn(component.dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as MatDialogRef<typeof component>);

    component.openDialog();

    expect(component.dialog.open).toHaveBeenCalled();
  });
});
