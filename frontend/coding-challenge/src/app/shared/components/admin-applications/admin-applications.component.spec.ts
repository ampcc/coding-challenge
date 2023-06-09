import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminApplicationsComponent } from './admin-applications.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { Application } from '../../models/application';
import { BackendService } from 'src/app/core/backend.service';
import { Challenge } from '../../models/challenge';
import { formatDate } from '@angular/common';

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


  it('display dialog on click on detail button in active applications', () => {
    expect(component.filteredApplicantsArray.length).toBe(0);

    let date = Date.now();

    let application1: Application = {
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

    component.filteredApplicantsArray = [application1];

    fixture.detectChanges();

    expect(component.filteredApplicantsArray.length).toBe(1);

    let detail: HTMLElement = fixture.debugElement.query(By.css('.details')).nativeElement;
    detail.click();

    fixture.detectChanges();

    let dialog = document.body.querySelector<HTMLInputElement>('.dialog_container');
    expect(dialog).toBeTruthy();
  });


  it('display dialog on click on detail button in archived applications', () => {
    expect(component.filteredArchivArray.length).toBe(0);

    let date = Date.now();

    let application1: Application = {
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

    component.filteredArchivArray = [application1];

    fixture.detectChanges();

    expect(component.filteredArchivArray.length).toBe(1);

    let detail: HTMLElement = fixture.debugElement.query(By.css('.details')).nativeElement;
    detail.click();

    fixture.detectChanges();

    let dialog = document.body.querySelector<HTMLInputElement>('.dialog_container');
    expect(dialog).toBeTruthy();
  });


  it('display dialog on click on edit button', () => {
    expect(component.filteredApplicantsArray.length).toBe(0);
    expect(component.challengeArray.length).toBe(0);

    let date = Date.now();

    let application1: Application = {
      applicationId: 'def456',
      applicationKey: '',
      passphrase: '',
      challengeId: 1,
      operatingSystem: '',
      programmingLanguage: '',
      expiry: 7539876,
      submission: date,
      githubRepo: '',
      status: 1
    };

    let challenge1: Challenge = {
      id: 1,
      challengeHeading: "Test1",
      challengeText: "This is the first test."
    };

    component.filteredApplicantsArray = [application1];
    component.challengeArray = [challenge1];

    fixture.detectChanges();

    expect(component.filteredApplicantsArray.length).toBe(1);
    expect(component.challengeArray.length).toBe(1);
    
    let edit: HTMLElement = fixture.debugElement.query(By.css('.edit')).nativeElement;
    edit.click();

    fixture.detectChanges();

    let dialog = document.body.querySelector<HTMLInputElement>('.dialog_container');
    expect(dialog).toBeTruthy();
  });


  it('display active applications correctly', () => {
    // Only test if the passed value is displayed correctly. The calculation itself is tested seperately.
    spyOn(backend, 'calcRemainingTime').and.returnValue(4 + " days " + 12 + " hours " + 45 + " minutes");

    let activeApplicationHTML = fixture.debugElement.queryAll(By.css('.single_applicant'));
    expect(component.filteredApplicantsArray.length).toBe(0);
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
    component.filteredApplicantsArray = [application1, application2];
    component.challengeArray = [challenge1, challenge2];

    let statusTextArray = ['not uploaded yet', 'uploaded'];

    fixture.detectChanges();

    activeApplicationHTML = fixture.debugElement.queryAll(By.css('.single_applicant'));
    expect(component.filteredApplicantsArray.length).toBe(2);
    expect(activeApplicationHTML.length).toBe(2);
    expect(component.applicantsArray.length).toBe(2);

    expect(component.challengeArray.length).toBe(2);
    
    for (let i = 0; i < activeApplicationHTML.length; i++) {
        const id: HTMLElement = activeApplicationHTML[i].query(By.css('.applicantId')).nativeElement;
        expect(id.innerHTML).toEqual(' ' + component.applicantsArray[i].applicationId + ' ');

        const challengeHeading = activeApplicationHTML[i].query(By.css('.challengeHeading')).nativeElement;
        expect(challengeHeading.innerHTML).toEqual('<b>Challenge:</b> ' + component.challengeArray[i].challengeHeading);

        const status: HTMLElement = activeApplicationHTML[i].query(By.css('.status')).nativeElement;
        expect(status.innerHTML).toEqual('<b>Status:</b> ' + statusTextArray[i]);

        let detailButton = activeApplicationHTML[i].query(By.css('.details'));
        let editButton = activeApplicationHTML[i].query(By.css('.edit'));

        if(status.innerHTML === '<b>Status:</b> uploaded') {
          const submission: HTMLElement = activeApplicationHTML[i].query(By.css('.submission')).nativeElement;
          expect(submission.innerHTML).toEqual('<b>Submission date:</b> ' + formatDate(Math.floor(date * 1000), "dd.MM.yyyy HH:mm", "en-US"));

          expect(detailButton).toBeTruthy();
          expect(editButton).toBeFalsy();
        } else {
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
    expect(component.filteredArchivArray.length).toBe(0);
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

    component.archivArray = [application1, application2];
    component.filteredArchivArray = [application1, application2];
    component.challengeArray = [challenge1, challenge2];

    fixture.detectChanges();

    archivedApplicationHTML = fixture.debugElement.queryAll(By.css('.single_archiv'));
    expect(component.filteredArchivArray.length).toBe(2);
    expect(archivedApplicationHTML.length).toBe(2);
    expect(component.archivArray.length).toBe(2);

    expect(component.challengeArray.length).toBe(2);
    
    for (let i = 0; i < archivedApplicationHTML.length; i++) {
        const id: HTMLElement = archivedApplicationHTML[i].query(By.css('.applicantId')).nativeElement;
        expect(id.innerHTML).toEqual(' ' + component.archivArray[i].applicationId + ' ');

        const challengeHeading = archivedApplicationHTML[i].query(By.css('.challengeHeading')).nativeElement;
        expect(challengeHeading.innerHTML).toEqual('<b>Challenge:</b> ' + component.challengeArray[i].challengeHeading);

        const submission: HTMLElement = archivedApplicationHTML[i].query(By.css('.submission')).nativeElement;
        expect(submission.innerHTML).toEqual('<b>Submission date:</b> ' + formatDate(Math.floor(date * 1000), "dd.MM.yyyy HH:mm", "en-US"));
      }
   });


   it('show and hide filter on click', () => {
    let filterButtonElement: HTMLElement = fixture.debugElement.query(By.css('#labelFilter')).nativeElement;
    
    // Initial state
    expect(component.hideFilterSelect).toBeTrue();
    
    filterButtonElement.click();

    fixture.detectChanges();

    expect(component.hideFilterSelect).toBeFalse();
   }); 


   it('displays filter options correctly in active applications', () => {
    let filterButtonElement: HTMLElement = fixture.debugElement.query(By.css('#labelFilter')).nativeElement;
    
    expect(component.hideFilterSelect).toBeTrue();
    
    filterButtonElement.click();

    fixture.detectChanges();

    expect(component.hideFilterSelect).toBeFalse();
    expect(component.hideContentActiveChallenges).toBeFalse();
   });


   it('displays filter options correctly in archive applications', () => {
    let filterButtonElement: HTMLElement = fixture.debugElement.query(By.css('#labelFilter')).nativeElement;
    
    component.hideContentArchiv = false;
    component.hideContentActiveChallenges = true;

    expect(component.hideFilterSelect).toBeTrue();
    
    filterButtonElement.click();

    fixture.detectChanges();

    expect(component.hideFilterSelect).toBeFalse();
    expect(component.hideContentActiveChallenges).toBeTrue();
   });
});
