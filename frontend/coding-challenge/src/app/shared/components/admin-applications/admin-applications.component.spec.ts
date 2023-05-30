import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminApplicationsComponent } from './admin-applications.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Test if Admin Applications Component works properly
describe('AdminApplicationsComponent', () => {
  let component: AdminApplicationsComponent;
  let fixture: ComponentFixture<AdminApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        HttpClient,
        MatDialog
      ],
      imports: [
        AdminApplicationsComponent,
        HttpClientModule,
        MatDialogModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Check if component can be created
  it('should create', () => {
    expect(component).toBeTruthy();
  });


  /**
   * Tests for admin_applications component
   * --> !! := Difficult test
   * --> ?? := Questionable if not already done by others or if it's even possible
   * 
   * General tests:
   * - Tabs change html (check if bools are correctly set (and if div of specific tab exists --> get element by id))
   * - ?? Correct navigation and ressource aquirement on ngInit
   * - Filter:
   *    - Filter is displayed/hidden on click
   *    - Filter options work correctly 
   * 
   * Tests for active_applications:
   * - Applicatios are displayed correctly
   * - ?? Detail-Dialog is correctly displayed
   * - ?? Extend-Dialog is correctly displayed 
   * 
   * Tests for archived_applications:
   * - Applicatios are displayed correctly
   * - ?? Detail-Dialog is correctly displayed
   * 
   * Other tests/stuff:
   * - ?? Dialog on click on question mark
   */
});
