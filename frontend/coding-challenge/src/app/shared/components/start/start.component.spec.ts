import { ComponentFixture, TestBed, async, fakeAsync, flush, tick } from '@angular/core/testing';
import { StartComponent } from './start.component';
import { HttpClient, HttpClientModule, HttpXhrBackend } from '@angular/common/http';
import { MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DialogComponent } from '../dialog/dialog.component';

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

    let dialog = document.body.querySelector<HTMLInputElement>('.dialog_container');

    expect(dialog).toBeTruthy();
  });

  // Check if dialog is opened on button click
  it('dialog opens on button click', fakeAsync(() => {
    let button = fixture.debugElement.nativeElement.querySelector('app-button');
    button.click();
    tick();

    let dialog = document.body.querySelector<HTMLInputElement>('.dialog_container');

    expect(dialog).toBeTruthy();

    flush();
  }));
});
