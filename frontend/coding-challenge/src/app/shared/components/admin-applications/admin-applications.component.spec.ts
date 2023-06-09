import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminApplicationsComponent } from './admin-applications.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { Application } from '../../models/application';
import { BackendService } from 'src/app/core/backend.service';
import { Challenge } from '../../models/challenge';
import { formatDate } from '@angular/common';

// Test if Admin Applications Component works properly
describe('AdminApplicationsComponent', () => {
  let component: AdminApplicationsComponent;
  let fixture: ComponentFixture<AdminApplicationsComponent>;
  let backend: BackendService;

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

    backend = TestBed.inject(BackendService);

    fixture = TestBed.createComponent(AdminApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('click on archive applications tab', () => {
    let activeChallengeTabElement: HTMLElement = fixture.debugElement.query(By.css('#tab_active_challenges')).nativeElement;
    let archiveChallengeTabElement: HTMLElement = fixture.debugElement.query(By.css('#tab_archiv')).nativeElement;
    
    let activeChallengeTabStyle: CSSStyleDeclaration = activeChallengeTabElement.style;
    let archiveChallengeTabStyle: CSSStyleDeclaration = archiveChallengeTabElement.style;

    // Initial state
    expect(component.hideContentArchiv).toBeTrue();
    expect(component.hideContentActiveChallenges).toBeFalse();
    // expect(challengeTabStyle.borderBottom).toEqual('none');
    // expect(uploadTabStyle.borderBottom).toEqual('none');
    // expect(introTabStyle.borderBottom).toEqual('2px solid black');

    archiveChallengeTabElement.click();

    expect(component.hideContentActiveChallenges).toBeTrue();
    expect(component.hideContentArchiv).toBeFalse();

    expect(activeChallengeTabStyle.borderBottom).toBe('none');
    expect(archiveChallengeTabStyle.borderBottomStyle).toBe('solid');
    expect(archiveChallengeTabStyle.borderBottomWidth).toBe('2px');
    expect(archiveChallengeTabStyle.borderBottomColor).toBe('black');
  });


  it('click on active challenge tab', () => {
    let activeChallengeTabElement: HTMLElement = fixture.debugElement.query(By.css('#tab_active_challenges')).nativeElement;
    let archiveChallengeTabElement: HTMLElement = fixture.debugElement.query(By.css('#tab_archiv')).nativeElement;
    
    let activeChallengeTabStyle: CSSStyleDeclaration = activeChallengeTabElement.style;
    let archiveChallengeTabStyle: CSSStyleDeclaration = archiveChallengeTabElement.style;
    // Initial state
    expect(component.hideContentArchiv).toBeTrue();
    expect(component.hideContentActiveChallenges).toBeFalse();
    // expect(challengeTabStyle.borderBottom).toEqual('none');
    // expect(uploadTabStyle.borderBottom).toEqual('none');
    // expect(introTabStyle.borderBottom).toEqual('2px solid black');

    activeChallengeTabElement.click();

    expect(component.hideContentActiveChallenges).toBeFalse();
    expect(component.hideContentArchiv).toBeTrue();
    
    expect(activeChallengeTabStyle.borderBottomStyle).toEqual('solid');
    expect(activeChallengeTabStyle.borderBottomWidth).toEqual('2px');
    expect(activeChallengeTabStyle.borderBottomColor).toEqual('black');
    expect(archiveChallengeTabStyle.borderBottom).toEqual('none');
  });


  it('correct filter results', () => {

  });


  it('correct search results', () => {

  });


  it('display dialog on click on detail or edit button', () => {
    let detail: HTMLElement = fixture.debugElement.query(By.css('.details')).nativeElement;
    detail.click();

    fixture.detectChanges();

    let dialog = document.body.querySelector<HTMLInputElement>('. ');
    expect(dialog).toBeTruthy();
  });


  it('display active applications correctly', () => {
    // Only test if the passed value is displayed correctly. The calculation itself is tested seperately.
    spyOn(backend, 'calcRemainingTime').and.returnValue(4 + " days " + 12 + " hours " + 45 + " minutes");

    let activeApplicationHTML = fixture.debugElement.queryAll(By.css('.single_applicant'));
    expect(activeApplicationHTML.length).toBe(0);
    expect(component.applicantsArray.length).toEqual(0);

    let date = Date.now();

    let application1: Application = {
      applicationId: 'abc123',
      applicationKey: '',
      passphrase: '',
      challengeId: 1,
      operatingSystem: '',
      programmingLanguage: '',
      expiry: 753,
      submission: date,
      githubRepo: '',
      status: 1
    };

    let application2: Application = {
      applicationId: 'def456',
      applicationKey: '',
      passphrase: '',
      challengeId: 2,
      operatingSystem: '',
      programmingLanguage: '',
      expiry: 753,
      submission: date,
      githubRepo: '',
      status: 3
    };


    let challenge1: Challenge = {
      id: 1,
      challengeHeading: "Test1",
      challengeText: "This is the first test."
    };

    let challenge2: Challenge = {
      id: 2,
      challengeHeading: "Test2",
      challengeText: "This is the second test."
    };

    component.applicantsArray = [application1, application2];
    component.challengeArray = [challenge1, challenge2];

    let statusTextArray = ['not uploaded yet', 'uploaded'];

    fixture.detectChanges();

    activeApplicationHTML = fixture.debugElement.queryAll(By.css('.single_applicant'));
    expect(activeApplicationHTML.length).toBe(2);
    expect(component.applicantsArray.length).toBe(2);

    expect(component.challengeArray.length).toBe(2);
    
    for (let i = 0; i < activeApplicationHTML.length; i++) {
        const id: HTMLElement = activeApplicationHTML[i].query(By.css('.applicantId')).nativeElement;
        expect(id.innerHTML).toEqual(component.applicantsArray[i].applicationId);

        const challengeHeading = activeApplicationHTML[i].query(By.css('.challengeHeading')).nativeElement;
        expect(challengeHeading.innerHTML).toEqual('<b>Challenge:</b> ' + component.challengeArray[i].challengeHeading);

        const status: HTMLElement = activeApplicationHTML[i].query(By.css('.status')).nativeElement;
        expect(status.innerHTML).toEqual('<b>Status:</b> ' + statusTextArray[i]);

        let detailButton = activeApplicationHTML[i].query(By.css('.details')).nativeElement;
        let editButton = activeApplicationHTML[i].query(By.css('.edit')).nativeElement;

        if(status.innerHTML === '<b>Status:</b> uploaded') {
          expect(component.hideTimeLimit).toBeTrue();
          expect(component.hideSubmissionDate).toBeFalse();

          const submission: HTMLElement = activeApplicationHTML[i].query(By.css('.submission')).nativeElement;
          expect(submission.innerHTML).toEqual('<b>Submission date:</b> ' + formatDate(Math.floor(date * 1000), "dd.MM.yyyy HH:mm", "en-US"));

          expect(detailButton).toBeTruthy();
          expect(editButton).toBeFalsy();
        } else {
          expect(component.hideTimeLimit).toBeFalse();
          expect(component.hideSubmissionDate).toBeTrue();

          const limit: HTMLElement = activeApplicationHTML[i].query(By.css('.limit')).nativeElement;
          expect(limit.innerHTML).toEqual('<b>Time limit:</b> ' + 4 + " days " + 12 + " hours " + 45 + " minutes");
        
          expect(detailButton).toBeFalsy();
          expect(editButton).toBeTruthy();
        }
      }
   });


   it('display archived applications correctly', () => {
    // Only test if the passed value is displayed correctly. The calculation itself is tested seperately.
    spyOn(backend, 'calcRemainingTime').and.returnValue(4 + " days " + 12 + " hours " + 45 + " minutes");

    let archivedApplicationHTML = fixture.debugElement.queryAll(By.css('.single_archiv'));
    expect(archivedApplicationHTML.length).toBe(0);
    expect(component.applicantsArray.length).toEqual(0);

    let date = Date.now();

    let application1: Application = {
      applicationId: 'abc123',
      applicationKey: '',
      passphrase: '',
      challengeId: 1,
      operatingSystem: '',
      programmingLanguage: '',
      expiry: 753,
      submission: date,
      githubRepo: '',
      status: 3
    };

    let application2: Application = {
      applicationId: 'def456',
      applicationKey: '',
      passphrase: '',
      challengeId: 2,
      operatingSystem: '',
      programmingLanguage: '',
      expiry: 753,
      submission: date,
      githubRepo: '',
      status: 5
    };


    let challenge1: Challenge = {
      id: 1,
      challengeHeading: "Test1",
      challengeText: "This is the first test."
    };

    let challenge2: Challenge = {
      id: 2,
      challengeHeading: "Test2",
      challengeText: "This is the second test."
    };

    component.applicantsArray = [application1, application2];
    component.challengeArray = [challenge1, challenge2];

    fixture.detectChanges();

    archivedApplicationHTML = fixture.debugElement.queryAll(By.css('.single_archiv'));
    expect(archivedApplicationHTML.length).toBe(1);
    expect(component.archivArray.length).toBe(1);

    expect(component.challengeArray.length).toBe(2);
    
    for (let i = 0; i < archivedApplicationHTML.length; i++) {
        const id: HTMLElement = archivedApplicationHTML[i].query(By.css('.applicantId')).nativeElement;
        expect(id.innerHTML).toEqual(component.applicantsArray[i].applicationId);

        const challengeHeading = archivedApplicationHTML[i].query(By.css('.challengeHeading')).nativeElement;
        expect(challengeHeading.innerHTML).toEqual('<b>Challenge:</b> ' + component.challengeArray[i].challengeHeading);

        const submission: HTMLElement = archivedApplicationHTML[i].query(By.css('.submission')).nativeElement;
        expect(submission.innerHTML).toEqual('<b>Submission date:</b> ' + formatDate(Math.floor(date * 1000), "dd.MM.yyyy HH:mm", "en-US"));
      }
   });


   it('show and hide filter on click', () => {
    let filterButtonElement: HTMLElement = fixture.debugElement.query(By.css('#labelFilter')).nativeElement;
    let filterElement: HTMLElement = fixture.debugElement.query(By.css('#filterTree')).nativeElement;
    
    // Initial state
    expect(component.hideFilterSelect).toBeTrue();
    
    filterButtonElement.click();

    expect(component.hideFilterSelect).toBeFalse();
   });
  

  /**
   * Tests for admin_applications component
   * --> !! := Difficult test
   * --> ?? := Questionable if not already done by others or if it's even possible
   * 
   * General tests:
   * - Tabs change html (check if bools are correctly set (and if div of specific tab exists --> get element by id)) ||
   * - ?? Correct navigation and ressource aquirement on ngInit
   * - Filter:
   *    - Filter is displayed/hidden on click ||
   *    - Filter options work correctly 
   * - Search works correctly
   * - Dialogs are correctly displayed ||
   * 
   * Tests for active_applications:
   * - Applicatios are displayed correctly ||
   * - correct Buttons are displayed ||
   * - either time limit or submission date are displayed ||

   * Tests for archived_applications:
   * - Applicatios are displayed correctly ||
   */
});
