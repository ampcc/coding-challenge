import { AppComponent } from './app.component';
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { By } from '@angular/platform-browser';

// Test if App Component works properly
describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                HttpClient,
                MatDialog
            ],
            declarations: [AppComponent],
            imports: [
                HttpClientModule,
                MatDialogModule,
                RouterModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // Check if component can be created
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // Check if logout and sidenav buttons are hidden on application page
    it('logout and sidenav buttons are hidden', () => {
        component.adminPage = false;
        fixture.detectChanges();

        let logout = fixture.debugElement.nativeElement.querySelector('.logout');
        let sidenav = fixture.debugElement.nativeElement.querySelector('.open_sitenav');

        expect(logout).toBeNull();
        expect(sidenav).toBeNull();
    });

    // Check if logout and sidenav buttons are displayed on admin page
    it('logout and sidenav buttons are displayed', () => {
        component.adminPage = true;
        fixture.detectChanges();

        let logout = fixture.debugElement.nativeElement.querySelector('.logout');
        let sidenav = fixture.debugElement.nativeElement.querySelector('.open_sitenav');

        expect(logout).toBeTruthy();
        expect(sidenav).toBeTruthy();
    });

    // Check if dialog shows up when logout button is pressed
    it('dialog opens on logout button press', fakeAsync(() => {
        component.adminPage = true;
        fixture.detectChanges();

        let button = fixture.debugElement.nativeElement.querySelector('.logout');
        button.click();
        tick();

        let dialog = document.body.querySelector<HTMLInputElement>('.dialog_container');

        expect(dialog).toBeTruthy();

        flush();
    }));

    // Check if sidenav shows up when open method is called
    it('sidenav opens on open call', () => {
        component.adminPage = true;
        fixture.detectChanges();

        component.openSitenav();
        fixture.detectChanges();

        let sidenav = !fixture.debugElement.nativeElement.querySelector('.sitenav').classList.contains('closed_sitenav');

        expect(sidenav).toBeTrue();
    });

    // Check if sidenav shows up when open sidenav button is pressed
    it('sidenav opens on open button press', fakeAsync(() => {
        component.adminPage = true;
        fixture.detectChanges();

        let button = fixture.debugElement.nativeElement.querySelector('.open_sitenav');
        button.click();
        tick();
        fixture.detectChanges();

        let sidenav = !fixture.debugElement.nativeElement.querySelector('.sitenav').classList.contains('closed_sitenav');

        expect(sidenav).toBeTrue();

        flush();
    }));

    // Check if sidenav is closed when close method is called
    it('sidenav closes on close call', () => {
        component.adminPage = true;
        fixture.detectChanges();

        component.openSitenav();
        fixture.detectChanges();

        component.closeSitenav();
        fixture.detectChanges();

        let sidenav = !fixture.debugElement.nativeElement.querySelector('.sitenav').classList.contains('closed_sitenav');

        expect(sidenav).toBeFalse();
    });

    // Check if sidenav is closed when close button is pressed
    it('sidenav closes on close button press', fakeAsync(() => {
        component.adminPage = true;
        fixture.detectChanges();

        component.openSitenav();
        fixture.detectChanges();

        let button = fixture.debugElement.nativeElement.querySelector('.close_sitenav');
        button.click();
        tick();
        fixture.detectChanges();

        let sidenav = !fixture.debugElement.nativeElement.querySelector('.sitenav').classList.contains('closed_sitenav');

        expect(sidenav).toBeFalse();

        flush();
    }));
});
