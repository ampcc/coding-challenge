import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminEditComponent } from './admin-edit.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

// Test if Admin Edit Component works properly
describe('AdminEditComponent', () => {
  let component: AdminEditComponent;
  let fixture: ComponentFixture<AdminEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        HttpClient,
        MatDialog
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

  // Check if component can be created
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
