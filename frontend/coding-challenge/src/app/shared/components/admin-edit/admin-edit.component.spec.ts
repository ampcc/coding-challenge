import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { AdminEditComponent } from './admin-edit.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { By } from '@angular/platform-browser';

// Test if Admin Edit Component works properly
describe('AdminEditComponent', () => {
  let component: AdminEditComponent;
  let fixture: ComponentFixture<AdminEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        HttpClient,
        MatDialog,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ 'id': '1' }),
          }
        }
      ],
      imports: [
        AdminEditComponent,
        HttpClientModule,
        MatDialogModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Check if dialog shows up when delete button is pressed
  it('dialog opens on delete button press', fakeAsync(() => {
    let button = fixture.debugElement.nativeElement.querySelector('.delete');
    button.click();
    tick();

    let dialog = document.body.querySelector<HTMLInputElement>('.dialog_container');

    expect(dialog).toBeTruthy();

    flush();
  }));

  // Check if error message underneath name field is hidden on default
  it('error message for name hidden on default', () => {
    let error = !fixture.debugElement.query(By.css('.name_error')).nativeElement.classList.contains('not_showing');

    expect(error).toBeFalse();
  });

  // Check if error message appears underneath name input field, if it is shorter than 4 characters
  it('error message on name when it is shorter than 4 characters', () => {
    component.editChallenge('t', 'test');
    fixture.detectChanges();

    let error = !fixture.debugElement.query(By.css('.name_error')).nativeElement.classList.contains('not_showing');

    expect(error).toBeTrue();
  });

  // Check if error message underneath description field is hidden on default
  it('error message for description hidden on default', () => {
    let error = !fixture.debugElement.query(By.css('.description_error')).nativeElement.classList.contains('not_showing');

    expect(error).toBeFalse();
  });

  // Check if error message appears underneath description input field, if it is shorter than 20 characters
  it('error message on description when it is shorter than 20 characters', () => {
    component.editChallenge('test', 'test');
    fixture.detectChanges();

    let error = !fixture.debugElement.query(By.css('.description_error')).nativeElement.classList.contains('not_showing');

    expect(error).toBeTrue();
  });

  // Check if success response is shown after successful changes
  it('success response is shown after successful changes', () => {
    spyOn(component.backendService, 'editChallenge').and.returnValue(of(true));
    component.editChallenge('test', 'testtesttesttesttest');
    fixture.detectChanges();

    let success_message = !fixture.debugElement.query(By.css('.alert')).nativeElement.classList.contains('not_showing');

    expect(component.successfulEdit).toBeTrue();
    expect(success_message).toBeTrue();
  });

  // Check if edit challenge call gets triggered on button click
  it('edit challenge call gets triggered on button click', fakeAsync(() => {
    let editChallenge = spyOn(component, 'editChallenge');

    let button = fixture.debugElement.nativeElement.querySelector('.confirm');
    button.click();
    tick();

    expect(editChallenge).toHaveBeenCalled();

    flush();
  }));

  // Check if edit challenge call gets triggered on enter press
  it('edit challenge call gets triggered on enter press', () => {
    let editChallenge = spyOn(component, 'editChallenge');

    let key_event = new KeyboardEvent("keypress", { "key": "Enter" });
    fixture.nativeElement.dispatchEvent(key_event);

    component.handleKeyDown(key_event);

    expect(editChallenge).toHaveBeenCalled();
  });

  // Check if cancel call gets triggered on button click
  it('cancel call gets triggered on button click', fakeAsync(() => {
    let cancel = spyOn(component, 'cancel');

    let button = fixture.debugElement.nativeElement.querySelector('.cancel');
    button.click();
    tick();

    expect(cancel).toHaveBeenCalled();

    flush();
  }));
});
