import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminChallengesComponent } from './admin-challenges.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Test if Admin Challenges Component works properly
describe('AdminChallengesComponent', () => {
  let component: AdminChallengesComponent;
  let fixture: ComponentFixture<AdminChallengesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        HttpClient,
        MatDialog
      ],
      imports: [
        AdminChallengesComponent,
        HttpClientModule,
        MatDialogModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Check if component can be created
  it('should create', () => {
    expect(component).toBeTruthy();
  });


  /**
   * Tests for admin_challenges component
   * --> !! := Difficult test
   * --> ?? := Questionable if not already done by others or if it's even possible
   * 
   * - Test add-challenge button --> correct navigation happens
   * - Challenges are correctly displayed --> Check heading
   * - ?? Check detail dialog
   * - ?? Check delete dialog
   */
});
