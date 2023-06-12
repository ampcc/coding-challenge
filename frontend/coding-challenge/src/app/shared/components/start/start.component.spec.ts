import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { StartComponent } from './start.component';
import { HttpClient, HttpClientModule, HttpXhrBackend } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

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
    component.openDialog();

    const dialog = document.body.querySelector<HTMLInputElement>('.dialog_container');

    expect(dialog).toBeTruthy();
  });

  // Check if dialog is opened on button click
  it('dialog opens on button click', fakeAsync(() => {
    const button = fixture.debugElement.nativeElement.querySelector('app-button');
    button.click();
    tick();

    const dialog = document.body.querySelector<HTMLInputElement>('.dialog_container');

    expect(dialog).toBeTruthy();

    flush();
  }));
});
