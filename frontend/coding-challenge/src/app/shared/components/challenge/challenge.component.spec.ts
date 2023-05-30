import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChallengeComponent } from './challenge.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

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


  it('click on intro tab', () => {
    let challengeTabElement: HTMLElement = fixture.debugElement.query(By.css('#tab_challenge')).nativeElement;
    let uploadTabElement: HTMLElement = fixture.debugElement.query(By.css('#tab_upload')).nativeElement;
    let introTabElement: HTMLElement = fixture.debugElement.query(By.css('#tab_intro')).nativeElement;
    let challengeTabStyle: CSSStyleDeclaration = challengeTabElement.style;
    let uploadTabStyle: CSSStyleDeclaration = uploadTabElement.style;
    let introTabStyle: CSSStyleDeclaration = introTabElement.style;

    // Initial state
    expect(component.hideContentChallenge).toBeTrue();
    expect(component.hideContentUpload).toBeTrue();
    expect(component.hideContentIntro).toBeFalse();
    // expect(challengeTabStyle.borderBottom).toBe('none');
    // expect(uploadTabStyle.borderBottom).toBe('none');
    // expect(introTabStyle.borderBottom).toBe('2px solid black');

    introTabElement.click();

    expect(component.hideContentChallenge).toBeTrue();
    expect(component.hideContentUpload).toBeTrue();
    expect(component.hideContentIntro).toBeFalse();
    expect(challengeTabStyle.borderBottom).toBe('none');
    expect(uploadTabStyle.borderBottom).toBe('none');
    expect(introTabStyle.borderBottomStyle).toBe('solid');
    expect(introTabStyle.borderBottomWidth).toBe('2px');
    expect(introTabStyle.borderBottomColor).toBe('black');
  });


  it('click on challenge tab', () => {
    let challengeTabElement: HTMLElement = fixture.debugElement.query(By.css('#tab_challenge')).nativeElement;
    let uploadTabElement: HTMLElement = fixture.debugElement.query(By.css('#tab_upload')).nativeElement;
    let introTabElement: HTMLElement = fixture.debugElement.query(By.css('#tab_intro')).nativeElement;
    let challengeTabStyle: CSSStyleDeclaration = challengeTabElement.style;
    let uploadTabStyle: CSSStyleDeclaration = uploadTabElement.style;
    let introTabStyle: CSSStyleDeclaration = introTabElement.style;

    // Initial state
    expect(component.hideContentChallenge).toBeTrue();
    expect(component.hideContentUpload).toBeTrue();
    expect(component.hideContentIntro).toBeFalse();
    // expect(challengeTabStyle.borderBottom).toBe('none');
    // expect(uploadTabStyle.borderBottom).toBe('none');
    // expect(introTabStyle.borderBottom).toBe('2px solid black');

    challengeTabElement.click();

    expect(component.hideContentChallenge).toBeFalse();
    expect(component.hideContentUpload).toBeTrue();
    expect(component.hideContentIntro).toBeTrue();
    expect(challengeTabStyle.borderBottomStyle).toBe('solid');
    expect(challengeTabStyle.borderBottomWidth).toBe('2px');
    expect(challengeTabStyle.borderBottomColor).toBe('black');
    expect(uploadTabStyle.borderBottom).toBe('none');
    expect(introTabStyle.borderBottom).toBe('none');
  });


  it('click on upload tab', () => {
    // fixture.detectChanges();
    let challengeTabElement: HTMLElement = fixture.debugElement.query(By.css('#tab_challenge')).nativeElement;
    let uploadTabElement: HTMLElement = fixture.debugElement.query(By.css('#tab_upload')).nativeElement;
    let introTabElement: HTMLElement = fixture.debugElement.query(By.css('#tab_intro')).nativeElement;
    let challengeTabStyle: CSSStyleDeclaration = challengeTabElement.style;
    let uploadTabStyle: CSSStyleDeclaration = uploadTabElement.style;
    let introTabStyle: CSSStyleDeclaration = introTabElement.style;

    // Initial state
    expect(component.hideContentChallenge).toBeTrue();
    expect(component.hideContentUpload).toBeTrue();
    expect(component.hideContentIntro).toBeFalse();
    // expect(challengeTabStyle.borderBottomStyle).toBe('none');
    // expect(uploadTabStyle.borderBottomStyle).toBe('none');
    // expect(introTabStyle.borderBottomStyle).toBe('solid');
    // expect(introTabStyle.borderBottomWidth).toBe('2px');
    // expect(introTabStyle.borderBottomColor).toBe('black');

    uploadTabElement.click();
    // fixture.detectChanges();

    expect(component.hideContentChallenge).toBeTrue();
    expect(component.hideContentUpload).toBeFalse();
    expect(component.hideContentIntro).toBeTrue();
    expect(challengeTabStyle.borderBottomStyle).toBe('none');
    expect(uploadTabStyle.borderBottomStyle).toBe('solid');
    expect(uploadTabStyle.borderBottomWidth).toBe('2px');
    expect(uploadTabStyle.borderBottomColor).toBe('black');
    expect(introTabStyle.borderBottomStyle).toBe('none');
  });


  it('should display time correctly', () => {
    let initialRemainingTimeHTML = "<b>Remaining Time:</b> No data available!"
    expect(fixture.debugElement.query(By.css('#time')).nativeElement.innerHTML).toBe(initialRemainingTimeHTML);
  });


  it('should display challenge text correctly', () => {
    let challengeTextDiv = fixture.debugElement.query(By.css('.text_challenge')).nativeElement;
    let initialChallengeTextHTML = "<b>No data available!</b><br><br> No data available! "
    expect(challengeTextDiv.innerHTML).toBe(initialChallengeTextHTML);
    
    component.challengeText = "I am another text for testing purposes";
    component.heading = "I am a text for testing purposes";
    fixture.detectChanges();

    let updatedChallengeTextHTML = `<b>${component.heading}</b><br><br> ${component.challengeText} `
    expect(challengeTextDiv.innerHTML).toBe(updatedChallengeTextHTML);
  });


  it('should store "programming language" correctly', () => {

  });


  it('should store "operating system" correctly', () => {

  });


  it('should display time correctly', () => {

  });


  it('should check uploaded file correcty', () => {

  });


  it('should display error messages on incorrect submit', () => {

  });


  it('should behave correctly after successful submit', () => {

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
