import { AppComponent } from './app.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

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
});
