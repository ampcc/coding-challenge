import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { AdminPasswordComponent } from './admin-password.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

// Test if Admin Password Component works properly
describe('AdminPasswordComponent', () => {
  let component: AdminPasswordComponent;
  let fixture: ComponentFixture<AdminPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        HttpClient,
        MatDialog
      ],
      imports: [
        AdminPasswordComponent,
        HttpClientModule,
        MatDialogModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Check if component can be created
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Check if error message underneath old password input field is hidden on default
  it('error message for old password hidden on default', () => {
    let error = !fixture.debugElement.query(By.css('.old_password_error')).nativeElement.classList.contains('not_showing');

    expect(error).toBeFalse();
  });

  // Check if error message appears underneath old password input field, if it is empty
  it('error message on empty old password', () => {
    component.setPassword('', '', '');
    fixture.detectChanges();

    let error = !fixture.debugElement.query(By.css('.old_password_error')).nativeElement.classList.contains('not_showing');

    expect(error).toBeTrue();
  });

  // Check if error message underneath new password input field is hidden on default
  it('error message for new password hidden on default', () => {
    let error = !fixture.debugElement.query(By.css('.new_password_error')).nativeElement.classList.contains('not_showing');

    expect(error).toBeFalse();
  });

  // Check if error message appears underneath new password input field, if it is empty
  it('error message on empty new password', () => {
    component.setPassword('', '', '');
    fixture.detectChanges();

    let error = !fixture.debugElement.query(By.css('.new_password_error')).nativeElement.classList.contains('not_showing');

    expect(error).toBeTrue();
  });

  // Check if error message underneath confirm password input field is hidden on default
  it('error message for confirm password hidden on default', () => {
    let error = !fixture.debugElement.query(By.css('.confirm_password_error')).nativeElement.classList.contains('not_showing');

    expect(error).toBeFalse();
  });

  // Check if error message appears underneath confirm password input field, if it is empty
  it('error message on empty confirm password', () => {
    component.setPassword('', '', '');
    fixture.detectChanges();

    let error = !fixture.debugElement.query(By.css('.confirm_password_error')).nativeElement.classList.contains('not_showing');

    expect(error).toBeTrue();
  });

  // Check if error message appears underneath new password input field, if it is shorter than eight characters
  it('error message on new password when shorter than eight characters', () => {
    component.setPassword('test', 'test', 'test');
    fixture.detectChanges();

    let error = !fixture.debugElement.query(By.css('.new_password_error')).nativeElement.classList.contains('not_showing');

    expect(error).toBeTrue();
    expect(component.newPasswordError).toContain('eight');
  });

  // Check if error message appears underneath new password input field, if it does not include at least one lowercase letter, uppercase letter, number, and special character
  it('error message on new password when not all needed characters are used', () => {
    component.setPassword('test', 'testtest', 'test');
    fixture.detectChanges();

    let error = !fixture.debugElement.query(By.css('.new_password_error')).nativeElement.classList.contains('not_showing');

    expect(error).toBeTrue();
    expect(component.newPasswordError).toContain('special');
  });

  // Check if error message appears underneath new password and confirm password input fields, if they are not the same
  it('error message on new and confirm password when they are not equal', () => {
    component.setPassword('test', 'Test#1234', 'testtest2');
    fixture.detectChanges();

    let new_error = !fixture.debugElement.query(By.css('.new_password_error')).nativeElement.classList.contains('not_showing');
    let confirm_error = !fixture.debugElement.query(By.css('.confirm_password_error')).nativeElement.classList.contains('not_showing');

    expect(new_error).toBeTrue();
    expect(confirm_error).toBeTrue();
    expect(component.newPasswordError).toContain('match');
    expect(component.confirmPasswordError).toContain('match');
  });

  // Check if success response is shown after successful changes
  it('success response is shown after succesful changes', () => {
    spyOn(component.backendService, 'changePassword').and.returnValue(of(true));
    component.setPassword('test', 'Test#1234', 'Test#1234');
    fixture.detectChanges();

    let success_message = !fixture.debugElement.query(By.css('.alert')).nativeElement.classList.contains('not_showing');

    expect(component.successfulChange).toBeTrue();
    expect(success_message).toBeTrue();
  });

  // Check if set password call gets triggered on button click
  it('set password call gets triggered on button click', fakeAsync(() => {
    let passwordChange = spyOn(component, 'setPassword');

    let button = fixture.debugElement.nativeElement.querySelector('.confirm');
    button.click();
    tick();

    expect(passwordChange).toHaveBeenCalled();

    flush();
  }));

  // Check if set password call gets triggered on enter press
  it('set password call gets triggered on enter press', () => {
    let passwordChange = spyOn(component, 'setPassword');

    let key_event = new KeyboardEvent("keypress", { "key": "Enter" });
    fixture.nativeElement.dispatchEvent(key_event);

    component.handleKeyDown(key_event);

    expect(passwordChange).toHaveBeenCalled();
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
