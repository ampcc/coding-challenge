import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChallengeComponent } from './challenge.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Test if Challenge Component works properly
describe('ChallengeComponent', () => {
  let component: ChallengeComponent;
  let fixture: ComponentFixture<ChallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        HttpClient,
        MatDialog
      ],
      imports: [
        ChallengeComponent,
        HttpClientModule,
        MatDialogModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Check if component can be created
  it('should create', () => {
    expect(component).toBeTruthy();
  });


  /**
   * Tests for challenge component
   * --> !! := Difficult test
   * --> ?? := Questionable if not already done by others or if it's even possible
   * 
   * General tests:
   * - Tabs change html (check if bools are correctly set (and if div of specific tab exists --> get element by id))
   * - Check if remaining time is correct
   * - ?? Correct navigation and ressource aquirement on ngInit
   * 
   * Tests for challenge_text tab:
   * - Correct heading displayed 
   * - Correct text displayed 
   * 
   * Tests for upload tab:
   * - Programming language correctly stored
   * - Text input for "other" programming language:
   *    - Displayed when "other" is selected
   *    - Value stored correctly
   * - OS correctly stored
   * - Text input for "other" os:
   *    - Displayed when "other" is selected
   *    - Value stored correctly
   * - File upload:
   *    - File is checked on upload (check error messages)
   *    - File is stored in input element AND fileArray
   *    - File is displayed visually under input
   *    - File is deleted from input element AND fileArray
   * - Submit button:
   *    - Error messages are correctly displayed
   *    - When everything is correct --> no error messages and upload call
   *    - !! Correct navigation on error response
   *    - !! Html switched to progress spinner and success
   * 
   * Other tests/stuff:
   * - ?? Dialog on click on question mark
   */
});
