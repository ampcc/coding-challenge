import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartComponent } from './start.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { of } from 'rxjs';

// Test if Start Component works properly
describe('StartComponent', () => {
  let component: StartComponent;
  let fixture: ComponentFixture<StartComponent>;
  const dialogMock = { close: () => { } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        HttpClient,
        MatDialog,
        { provide: MatDialogRef, useValue: dialogMock }
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
    let spyOnDialog = spyOn(component.dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as MatDialogRef<typeof component>);

    component.openDialog();

    expect(spyOnDialog).toHaveBeenCalled();
  });
});
