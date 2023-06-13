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


  it('click on archived applications tab', () => {
    let activeApplicationsTabElement: HTMLElement = fixture.debugElement.query(By.css('#tabActiveApplications')).nativeElement;
    let archivedApplicationsTabElement: HTMLElement = fixture.debugElement.query(By.css('#tabArchivedApplications')).nativeElement;

    let activeApplicationsTabStyle: CSSStyleDeclaration = activeApplicationsTabElement.style;
    let archivedApplicationsTabStyle: CSSStyleDeclaration = archivedApplicationsTabElement.style;

    // Initial state
    expect(component.hideContentArchivedApplications).toBeTrue();
    expect(component.hideContentActiveApplications).toBeFalse();

    archivedApplicationsTabElement.click();

    expect(component.hideContentActiveApplications).toBeTrue();
    expect(component.hideContentArchivedApplications).toBeFalse();

    expect(activeApplicationsTabStyle.borderBottom).toBe('none');
    expect(archivedApplicationsTabStyle.borderBottomStyle).toBe('solid');
    expect(archivedApplicationsTabStyle.borderBottomWidth).toBe('2px');
    expect(archivedApplicationsTabStyle.borderBottomColor).toBe('black');
  });


  it('click on active applications tab', () => {
    let activeApplicationsTabElement: HTMLElement = fixture.debugElement.query(By.css('#tabActiveApplications')).nativeElement;
    let archivedApplicationsTabElement: HTMLElement = fixture.debugElement.query(By.css('#tabArchivedApplications')).nativeElement;

    let activeApplicationsTabStyle: CSSStyleDeclaration = activeApplicationsTabElement.style;
    let archivedApplicationsTabStyle: CSSStyleDeclaration = archivedApplicationsTabElement.style;
    // Initial state
    expect(component.hideContentArchivedApplications).toBeTrue();
    expect(component.hideContentActiveApplications).toBeFalse();

    activeApplicationsTabElement.click();

    expect(component.hideContentActiveApplications).toBeFalse();
    expect(component.hideContentArchivedApplications).toBeTrue();

    expect(activeApplicationsTabStyle.borderBottomStyle).toEqual('solid');
    expect(activeApplicationsTabStyle.borderBottomWidth).toEqual('2px');
    expect(activeApplicationsTabStyle.borderBottomColor).toEqual('black');
    expect(archivedApplicationsTabStyle.borderBottom).toEqual('none');
  });


  it('correct filter results of active applications', () => {
    let activeApplicationHTML = fixture.debugElement.queryAll(By.css('.singleApplication'));
    expect(component.filteredApplicationsArray.length).toBe(0);
    expect(activeApplicationHTML.length).toBe(0);
    expect(component.applicationsArray.length).toEqual(0);

    const date = Date.now();

    const application1: Application = {
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

    const application2: Application = {
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


    const application3: Application = {
      applicationId: 'ghi789',
      applicationKey: '',
      passphrase: '',
      challengeId: 2,
      operatingSystem: '',
      programmingLanguage: '',
      expiry: 753,
      submission: date,
      githubRepo: '',
      status: 4
    };


    const challenge1: Challenge = {
      id: 1,
      challengeHeading: "Test1",
      challengeText: "This is the first test.",
      active: true
    };

    const challenge2: Challenge = {
      id: 2,
      challengeHeading: "Test2",
      challengeText: "This is the second test.",
      active: true
    };

    component.applicationsArray = [application1, application2, application3];
    component.filteredApplicationsArray = [application1, application2, application3];
    component.challengeArray = [challenge1, challenge2];

    const statusTextArray = ['not_uploaded_yet', 'uploaded', 'not_submitted_in_time'];

    fixture.detectChanges();

    activeApplicationHTML = fixture.debugElement.queryAll(By.css('.singleApplication'));
    expect(component.filteredApplicationsArray.length).toBe(3);
    expect(activeApplicationHTML.length).toBe(3);
    expect(component.applicationsArray.length).toBe(3);
    expect(component.challengeArray.length).toBe(2);

    for(let i = 0; i < component.challengeArray.length; i++) {
      const challengeFilter = fixture.debugElement.query(By.css(`#challenge${component.challengeArray[i].id}`)).nativeElement;
      challengeFilter.click();
      fixture.detectChanges();

      switch(component.challengeArray[i]) {
        case challenge1:
          expect(component.filteredApplicationsArray).toContain(application1);
          expect(component.filteredApplicationsArray.indexOf(application2)).toBe(-1);
          expect(component.filteredApplicationsArray.indexOf(application3)).toBe(-1);
        break;
        case challenge2:
          expect(component.filteredApplicationsArray.indexOf(application1)).toBe(-1);
          expect(component.filteredApplicationsArray).toContain(application2);
          expect(component.filteredApplicationsArray).toContain(application3);
          break;
        default:
          throw Error('No identified challenge inside challenge Array in test "correct filter results of active applications"');
      }

      challengeFilter.click();
      fixture.detectChanges();
    }

    for (let i = 0; i < statusTextArray.length; i++) {
      const statusFilter = fixture.debugElement.query(By.css(`#${statusTextArray[i]}`)).nativeElement;
      statusFilter.click();
      fixture.detectChanges();

      switch(statusTextArray[i]) {
        case 'not_uploaded_yet':
          expect(component.filteredApplicationsArray).toContain(application1);
          expect(component.filteredApplicationsArray.indexOf(application2)).toBe(-1);
          expect(component.filteredApplicationsArray.indexOf(application3)).toBe(-1);
        break;
        case 'uploaded':
          expect(component.filteredApplicationsArray.indexOf(application1)).toBe(-1);
          expect(component.filteredApplicationsArray).toContain(application2);
          expect(component.filteredApplicationsArray.indexOf(application3)).toBe(-1);
          break;
        case 'not_submitted_in_time':
          expect(component.filteredApplicationsArray.indexOf(application1)).toBe(-1);
          expect(component.filteredApplicationsArray.indexOf(application2)).toBe(-1);
          expect(component.filteredApplicationsArray).toContain(application3);
          break;
        default:
          throw Error('No identified status inside challenge Array in test "correct filter results of active applications"');
      }

      statusFilter.click();
      fixture.detectChanges();
    }
  });


  it('correct filter results of archived applications', () => {
    let archivedApplicationHTML = fixture.debugElement.queryAll(By.css('.singleArchived'));
    expect(component.filteredArchivedArray.length).toBe(0);
    expect(archivedApplicationHTML.length).toBe(0);
    expect(component.applicationsArray.length).toEqual(0);

    const date = Date.now();

    const application1: Application = {
      applicationId: 'abc123',
      applicationKey: '',
      passphrase: '',
      challengeId: 1,
      operatingSystem: '',
      programmingLanguage: '',
      expiry: 753,
      submission: date,
      githubRepo: '',
      status: 5
    };

    const application2: Application = {
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


    const application3: Application = {
      applicationId: 'ghi789',
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


    const challenge1: Challenge = {
      id: 1,
      challengeHeading: "Test1",
      challengeText: "This is the first test.",
      active: true
    };

    const challenge2: Challenge = {
      id: 2,
      challengeHeading: "Test2",
      challengeText: "This is the second test.",
      active: true
    };

    component.archivedArray = [application1, application2, application3];
    component.filteredArchivedArray = [application1, application2, application3];
    component.challengeArray = [challenge1, challenge2];

    fixture.detectChanges();

    archivedApplicationHTML = fixture.debugElement.queryAll(By.css('.singleArchived'));
    expect(component.filteredArchivedArray.length).toBe(3);
    expect(archivedApplicationHTML.length).toBe(3);
    expect(component.archivedArray.length).toBe(3);
    expect(component.challengeArray.length).toBe(2);

    for(let i = 0; i < component.challengeArray.length; i++) {
      const challengeFilter = fixture.debugElement.query(By.css(`#challenge${component.challengeArray[i].id}`)).nativeElement;
      challengeFilter.click();
      fixture.detectChanges();

      switch(component.challengeArray[i]) {
        case challenge1:
          expect(component.filteredArchivedArray).toContain(application1);
          expect(component.filteredArchivedArray.indexOf(application2)).toBe(-1);
          expect(component.filteredArchivedArray.indexOf(application3)).toBe(-1);
        break;
        case challenge2:
          expect(component.filteredArchivedArray.indexOf(application1)).toBe(-1);
          expect(component.filteredArchivedArray).toContain(application2);
          expect(component.filteredArchivedArray).toContain(application3);
          break;
        default:
          throw Error('No identified challenge inside challenge Array in test "correct filter results of archived applications"');
      }

      challengeFilter.click();
      fixture.detectChanges();
    }
  });


  it('correct search results for active applications', () => {
    let activeApplicationHTML = fixture.debugElement.queryAll(By.css('.singleApplication'));
    expect(component.filteredApplicationsArray.length).toBe(0);
    expect(activeApplicationHTML.length).toBe(0);
    expect(component.applicationsArray.length).toEqual(0);

    const date = Date.now();

    const application1: Application = {
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

    const application2: Application = {
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


    const application3: Application = {
      applicationId: 'ghi789',
      applicationKey: '',
      passphrase: '',
      challengeId: 2,
      operatingSystem: '',
      programmingLanguage: '',
      expiry: 753,
      submission: date,
      githubRepo: '',
      status: 4
    };

    component.applicationsArray = [application1, application2, application3];
    component.filteredApplicationsArray = [application1, application2, application3];

    fixture.detectChanges();

    activeApplicationHTML = fixture.debugElement.queryAll(By.css('.singleApplication'));
    expect(component.filteredApplicationsArray.length).toBe(3);
    expect(activeApplicationHTML.length).toBe(3);
    expect(component.applicationsArray.length).toBe(3);


    const searchBar: HTMLInputElement = fixture.debugElement.query(By.css('#inputSearchBar')).nativeElement;
    const searchButton = fixture.debugElement.query(By.css('#button-addon5')).nativeElement;

    searchBar.value = '    def456   ';
    searchButton.click();

    fixture.detectChanges();

    expect(component.filteredApplicationsArray.length).toBe(1);
    expect(component.filteredApplicationsArray).toContain(application2);

    searchBar.value = '    def457   ';
    searchButton.click();

    fixture.detectChanges();

    expect(component.filteredApplicationsArray.length).toBe(0);

    searchBar.value = 'abc123';
    searchButton.click();

    fixture.detectChanges();

    expect(component.filteredApplicationsArray.length).toBe(1);
    expect(component.filteredApplicationsArray).toContain(application1);
  });


  it('correct search results for archived applications', () => {
    let archivedApplicationHTML = fixture.debugElement.queryAll(By.css('.singleArchived'));
    expect(component.filteredArchivedArray.length).toBe(0);
    expect(archivedApplicationHTML.length).toBe(0);
    expect(component.applicationsArray.length).toEqual(0);

    const date = Date.now();

    const application1: Application = {
      applicationId: 'abc123',
      applicationKey: '',
      passphrase: '',
      challengeId: 1,
      operatingSystem: '',
      programmingLanguage: '',
      expiry: 753,
      submission: date,
      githubRepo: '',
      status: 5
    };

    const application2: Application = {
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


    const application3: Application = {
      applicationId: 'ghi789',
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

    component.archivedArray = [application1, application2, application3];
    component.filteredArchivedArray = [application1, application2, application3];

    fixture.detectChanges();

    archivedApplicationHTML = fixture.debugElement.queryAll(By.css('.singleArchived'));
    expect(component.filteredArchivedArray.length).toBe(3);
    expect(archivedApplicationHTML.length).toBe(3);
    expect(component.archivedArray.length).toBe(3);


    const searchBar: HTMLInputElement = fixture.debugElement.query(By.css('#inputSearchBar')).nativeElement;
    const searchButton = fixture.debugElement.query(By.css('#button-addon5')).nativeElement;

    searchBar.value = '    def456   ';
    searchButton.click();

    fixture.detectChanges();

    expect(component.filteredArchivedArray.length).toBe(1);
    expect(component.filteredArchivedArray).toContain(application2);

    searchBar.value = '    def457   ';
    searchButton.click();

    fixture.detectChanges();

    expect(component.filteredArchivedArray.length).toBe(0);

    searchBar.value = 'abc123';
    searchButton.click();

    fixture.detectChanges();

    expect(component.filteredArchivedArray.length).toBe(1);
    expect(component.filteredArchivedArray).toContain(application1);
  });


  it('display dialog on click on edit button', () => {
    expect(component.filteredApplicationsArray.length).toBe(0);
    expect(component.challengeArray.length).toBe(0);

    const date = Date.now();

    const application1: Application = {
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

    const challenge1: Challenge = {
      id: 1,
      challengeHeading: "Test1",
      challengeText: "This is the first test.",
      active: true
    };

    component.filteredApplicationsArray = [application1];
    component.challengeArray = [challenge1];

    fixture.detectChanges();

    expect(component.filteredApplicationsArray.length).toBe(1);
    expect(component.challengeArray.length).toBe(1);

    const edit: HTMLElement = fixture.debugElement.query(By.css('.edit')).nativeElement;
    edit.click();

    fixture.detectChanges();

    const dialog = document.body.querySelector<HTMLInputElement>('.dialog_container');
    expect(dialog).toBeTruthy();
  });


  it('display active applications correctly', () => {
    // Only test if the passed value is displayed correctly. The calculation itself is tested seperately.
    spyOn(backend, 'calcRemainingTime').and.returnValue(4 + " days " + 12 + " hours " + 45 + " minutes");

    let activeApplicationHTML = fixture.debugElement.queryAll(By.css('.singleApplication'));
    expect(component.filteredApplicationsArray.length).toBe(0);
    expect(activeApplicationHTML.length).toBe(0);
    expect(component.applicationsArray.length).toEqual(0);

    const date = Date.now();

    const application1: Application = {
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

    const application2: Application = {
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


    const challenge1: Challenge = {
      id: 1,
      challengeHeading: "Test1",
      challengeText: "This is the first test.",
      active: true
    };

    const challenge2: Challenge = {
      id: 2,
      challengeHeading: "Test2",
      challengeText: "This is the second test.",
      active: true
    };

    component.applicationsArray = [application1, application2];
    component.filteredApplicationsArray = [application1, application2];
    component.challengeArray = [challenge1, challenge2];

    const statusTextArray = ['not uploaded yet', 'uploaded'];

    fixture.detectChanges();

    activeApplicationHTML = fixture.debugElement.queryAll(By.css('.singleApplication'));
    expect(component.filteredApplicationsArray.length).toBe(2);
    expect(activeApplicationHTML.length).toBe(2);
    expect(component.applicationsArray.length).toBe(2);

    expect(component.challengeArray.length).toBe(2);

    for (let i = 0; i < activeApplicationHTML.length; i++) {
        const id: HTMLElement = activeApplicationHTML[i].query(By.css('.applicantId')).nativeElement;
        expect(id.innerHTML).toEqual(' ' + component.applicationsArray[i].applicationId + ' ');

        const challengeHeading = activeApplicationHTML[i].query(By.css('.challengeHeading')).nativeElement;
        expect(challengeHeading.innerHTML).toEqual('<b>Challenge:</b> ' + component.challengeArray[i].challengeHeading);

        const status: HTMLElement = activeApplicationHTML[i].query(By.css('.status')).nativeElement;
        expect(status.innerHTML).toEqual('<b>Status:</b> ' + statusTextArray[i]);

        const detailButton = activeApplicationHTML[i].query(By.css('.details'));
        const editButton = activeApplicationHTML[i].query(By.css('.edit'));

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

    let archivedApplicationHTML = fixture.debugElement.queryAll(By.css('.singleArchived'));
    expect(component.filteredArchivedArray.length).toBe(0);
    expect(archivedApplicationHTML.length).toBe(0);
    expect(component.applicationsArray.length).toEqual(0);

    const date = Date.now();

    const application1: Application = {
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

    const application2: Application = {
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


    const challenge1: Challenge = {
      id: 1,
      challengeHeading: "Test1",
      challengeText: "This is the first test.",
      active: true
    };

    const challenge2: Challenge = {
      id: 2,
      challengeHeading: "Test2",
      challengeText: "This is the second test.",
      active: true
    };

    component.archivedArray = [application1, application2];
    component.filteredArchivedArray = [application1, application2];
    component.challengeArray = [challenge1, challenge2];

    fixture.detectChanges();

    archivedApplicationHTML = fixture.debugElement.queryAll(By.css('.singleArchived'));
    expect(component.filteredArchivedArray.length).toBe(2);
    expect(archivedApplicationHTML.length).toBe(2);
    expect(component.archivedArray.length).toBe(2);

    expect(component.challengeArray.length).toBe(2);

    for (let i = 0; i < archivedApplicationHTML.length; i++) {
        const id: HTMLElement = archivedApplicationHTML[i].query(By.css('.applicantId')).nativeElement;
        expect(id.innerHTML).toEqual(' ' + component.archivedArray[i].applicationId + ' ');

        const challengeHeading = archivedApplicationHTML[i].query(By.css('.challengeHeading')).nativeElement;
        expect(challengeHeading.innerHTML).toEqual('<b>Challenge:</b> ' + component.challengeArray[i].challengeHeading);

        const submission: HTMLElement = archivedApplicationHTML[i].query(By.css('.submission')).nativeElement;
        expect(submission.innerHTML).toEqual('<b>Submission date:</b> ' + formatDate(Math.floor(date * 1000), "dd.MM.yyyy HH:mm", "en-US"));
      }
   });


   it('show and hide filter on click', () => {
    const filterButtonElement: HTMLElement = fixture.debugElement.query(By.css('#labelFilter')).nativeElement;

    // Initial state
    expect(component.hideFilterSelect).toBeTrue();

    filterButtonElement.click();

    fixture.detectChanges();

    expect(component.hideFilterSelect).toBeFalse();
   });


   it('displays filter options correctly in active applications', () => {
    const filterButtonElement: HTMLElement = fixture.debugElement.query(By.css('#labelFilter')).nativeElement;

    expect(component.hideFilterSelect).toBeTrue();

    filterButtonElement.click();

    fixture.detectChanges();

    expect(component.hideFilterSelect).toBeFalse();
    expect(component.hideContentActiveApplications).toBeFalse();
   });


   it('displays filter options correctly in archive applications', () => {
    const filterButtonElement: HTMLElement = fixture.debugElement.query(By.css('#labelFilter')).nativeElement;

    component.hideContentArchivedApplications = false;
    component.hideContentActiveApplications = true;

    expect(component.hideFilterSelect).toBeTrue();

    filterButtonElement.click();

    fixture.detectChanges();

    expect(component.hideFilterSelect).toBeFalse();
    expect(component.hideContentActiveApplications).toBeTrue();
   });
});
