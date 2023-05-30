import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { AdminLoginComponent } from './admin-login.component';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

// Test if Admin Login Component works properly
describe('AdminLoginComponent', () => {
  let component: AdminLoginComponent;
  let fixture: ComponentFixture<AdminLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        HttpClient,
        MatDialog
      ],
      imports: [
        AdminLoginComponent,
        HttpClientModule,
        MatDialogModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Check if component can be created
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Check if error message underneath username input field is hidden on default
  it('error message for username hidden on default', () => {
    let error = !fixture.debugElement.query(By.css('.username_error')).nativeElement.classList.contains('no_error');

    expect(error).toBeFalse();
  });

  // Check if error message appears underneath username input field, if it is empty
  it('error message on empty username', () => {
    component.login('', '');
    fixture.detectChanges();

    let error = !fixture.debugElement.query(By.css('.username_error')).nativeElement.classList.contains('no_error');

    expect(error).toBeTrue();
  });

  // Check if error message underneath password input field is hidden on default
  it('error message for password hidden on default', () => {
    let error = !fixture.debugElement.query(By.css('.password_error')).nativeElement.classList.contains('no_error');

    expect(error).toBeFalse();
  });

  // Check if error message appears underneath password input field, if it is empty
  it('error message on empty password', () => {
    component.login('', '');
    fixture.detectChanges();

    let error = !fixture.debugElement.query(By.css('.password_error')).nativeElement.classList.contains('no_error');

    expect(error).toBeTrue();
  });

  // Check if login call gets triggered on button click
  it('login call gets triggered on button click', fakeAsync(() => {
    let login = spyOn(component, 'login');

    let button = fixture.debugElement.nativeElement.querySelector('app-button');
    button.click();
    tick();

    expect(login).toHaveBeenCalled();

    flush();
  }));

  // Check if login call gets triggered on enter press
  it('login call gets triggered on enter press', () => {
    let login = spyOn(component, 'login');

    let key_event = new KeyboardEvent("keypress", { "key": "Enter" });
    fixture.nativeElement.dispatchEvent(key_event);

    component.handleKeyDown(key_event);

    expect(login).toHaveBeenCalled();
  });
});
