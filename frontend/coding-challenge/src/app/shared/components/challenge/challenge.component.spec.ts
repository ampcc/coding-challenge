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
    // expect(challengeTabStyle.borderBottom).toEqual('none');
    // expect(uploadTabStyle.borderBottom).toEqual('none');
    // expect(introTabStyle.borderBottom).toEqual('2px solid black');

    introTabElement.click();

    expect(component.hideContentChallenge).toBeTrue();
    expect(component.hideContentUpload).toBeTrue();
    expect(component.hideContentIntro).toBeFalse();
    expect(challengeTabStyle.borderBottom).toEqual('none');
    expect(uploadTabStyle.borderBottom).toEqual('none');
    expect(introTabStyle.borderBottomStyle).toEqual('solid');
    expect(introTabStyle.borderBottomWidth).toEqual('2px');
    expect(introTabStyle.borderBottomColor).toEqual('black');
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
    // expect(challengeTabStyle.borderBottom).toEqual('none');
    // expect(uploadTabStyle.borderBottom).toEqual('none');
    // expect(introTabStyle.borderBottom).toEqual('2px solid black');

    challengeTabElement.click();

    expect(component.hideContentChallenge).toBeFalse();
    expect(component.hideContentUpload).toBeTrue();
    expect(component.hideContentIntro).toBeTrue();
    expect(challengeTabStyle.borderBottomStyle).toEqual('solid');
    expect(challengeTabStyle.borderBottomWidth).toEqual('2px');
    expect(challengeTabStyle.borderBottomColor).toEqual('black');
    expect(uploadTabStyle.borderBottom).toEqual('none');
    expect(introTabStyle.borderBottom).toEqual('none');
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
    // expect(challengeTabStyle.borderBottomStyle).toEqual('none');
    // expect(uploadTabStyle.borderBottomStyle).toEqual('none');
    // expect(introTabStyle.borderBottomStyle).toEqual('solid');
    // expect(introTabStyle.borderBottomWidth).toEqual('2px');
    // expect(introTabStyle.borderBottomColor).toEqual('black');

    uploadTabElement.click();
    // fixture.detectChanges();

    expect(component.hideContentChallenge).toBeTrue();
    expect(component.hideContentUpload).toBeFalse();
    expect(component.hideContentIntro).toBeTrue();
    expect(challengeTabStyle.borderBottomStyle).toEqual('none');
    expect(uploadTabStyle.borderBottomStyle).toEqual('solid');
    expect(uploadTabStyle.borderBottomWidth).toEqual('2px');
    expect(uploadTabStyle.borderBottomColor).toEqual('black');
    expect(introTabStyle.borderBottomStyle).toEqual('none');
  });


  it('display time correctly', () => {
    let timeParagraph = fixture.debugElement.query(By.css('#time')).nativeElement;
    let initialRemainingTimeHTML = "<b>Remaining Time:</b> No data available!"
    expect(timeParagraph.innerHTML).toEqual(initialRemainingTimeHTML);

    /**
     * Time only gets calculated inside ngOnInit
     * --> Difficult to test, so only the correct display of the string is tested
     */

    component.time = 4 + " days " + 12 + " hours " + 36 + " minutes";
    fixture.detectChanges();

    let updatedRemainingTimeHTML = `<b>Remaining Time:</b> ${component.time}`;
    expect(timeParagraph.innerHTML).toEqual(updatedRemainingTimeHTML);
  });


  it('display challenge text correctly', () => {
    let challengeTextDiv = fixture.debugElement.query(By.css('.text_challenge')).nativeElement;
    let initialChallengeTextHTML = "<b>No data available!</b><br><br> No data available! "
    expect(challengeTextDiv.innerHTML).toEqual(initialChallengeTextHTML);
    
    component.challengeText = "I am another text for testing purposes";
    component.heading = "I am a text for testing purposes";
    fixture.detectChanges();

    let updatedChallengeTextHTML = `<b>${component.heading}</b><br><br> ${component.challengeText} `
    expect(challengeTextDiv.innerHTML).toEqual(updatedChallengeTextHTML);
  });


  it('store selected "programming language" correctly', () => {
    // let programmingLanguageSelectOptions = fixture.debugElement.query(By.css('#selectProgLang')).childNodes;

    // let currentOptionNode: HTMLInputElement = programmingLanguageSelectOptions[0].nativeNode;
    // expect(currentOptionNode.disabled).toBeTrue();
    // currentOptionNode.click();
    // fixture.detectChanges();
    // expect(component.pl).toEqual('default');

    // currentOptionNode = programmingLanguageSelectOptions[1].nativeNode;
    // expect(currentOptionNode.disabled).toBeFalse();
    // currentOptionNode.click();
    // currentOptionNode.select();
    // fixture.detectChanges();
    // expect(component.pl).toEqual('java');
  });


  it('store other "programming language" correctly', () => {

  });


  it('store selected "operating system" correctly', () => {

  });


  it('store other "operating system" correctly', () => {

  });


  it('check uploaded file correctly', () => {

  });


  it('delete uploaded file correctly', () => {

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
   * - Tabs change html (check if bools are correctly set (and if div of specific tab exists --> get element by id)) ||
   * - Check if remaining time is correct
   * - ?? Correct navigation and ressource aquirement on ngInit
   * 
   * Tests for challenge_text tab:
   * - Correct heading displayed ||
   * - Correct text displayed ||
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
