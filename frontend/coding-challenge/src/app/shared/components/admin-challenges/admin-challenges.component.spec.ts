import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdminChallengesComponent } from './admin-challenges.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { Challenge } from '../../models/challenge';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('AdminChallengesComponent', () => {
  let component: AdminChallengesComponent;
  let fixture: ComponentFixture<AdminChallengesComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        HttpClient,
        MatDialog
      ],
      imports: [
        AdminChallengesComponent,
        HttpClientModule,
        MatDialogModule,
        RouterTestingModule.withRoutes([])
      ]
    }).compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(AdminChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should navigate correctly', fakeAsync(() => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.addChallenge();
    tick();
    expect(navigateSpy).toHaveBeenCalledWith('/admin_edit_challenge');
  }));


  it('display challenges correctly', () => {
    let challengesHTML = fixture.debugElement.queryAll(By.css('.single_challenge'));
    expect(challengesHTML.length).toEqual(0);
    expect(component.challengeArray.length).toEqual(0);

    let challenge1: Challenge = {
      id: 1,
      challengeHeading: "Test1",
      challengeText: "This is the first test.",
      active: true
    };

    let challenge2: Challenge = {
      id: 2,
      challengeHeading: "Test2",
      challengeText: "This is the second test.",
      active: true
    };

    component.challengeArray = [challenge1, challenge2];
    fixture.detectChanges();

    challengesHTML = fixture.debugElement.queryAll(By.css('.single_challenge'));
    expect(challengesHTML.length).toEqual(2);
    expect(component.challengeArray.length).toEqual(2);

    for (let i = 0; i < challengesHTML.length; i++) {
        const element: HTMLElement = challengesHTML[i].query(By.css('.challengeId')).nativeElement;
        expect(element.innerText).toEqual(component.challengeArray[i].challengeHeading);
      }
   });


   it('display dialog on click on detail button', () => {
    expect(component.challengeArray.length).toEqual(0);

    let challenge1: Challenge = {
      id: 1,
      challengeHeading: "Test1",
      challengeText: "This is the first test."
    };

    component.challengeArray = [challenge1];

    fixture.detectChanges();

    expect(component.challengeArray.length).toEqual(1);

    let detail: HTMLElement = fixture.debugElement.query(By.css('.details')).nativeElement;
    detail.click();

    fixture.detectChanges();

    let dialog = document.body.querySelector<HTMLInputElement>('.dialog_container');
    expect(dialog).toBeTruthy();
  });
});
