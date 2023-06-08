import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdminChallengesComponent } from './admin-challenges.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { Challenge } from '../../models/challenge';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

// Test if Admin Challenges Component works properly
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

  // Check if component can be created
  it('should create', () => {
    expect(component).toBeTruthy();
  });


  // Test add-challenge button
  it('should navigate correctly', fakeAsync(() => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.addChallenge();
    tick();
    expect(navigateSpy).toHaveBeenCalledWith('/admin_edit_challenge');
  }));


  // Test the correct display of the challenges
  it('display challenges correctly', () => {
    let challengesHTML = fixture.debugElement.queryAll(By.css('.single_challenge'));
    expect(challengesHTML.length).toEqual(0);
    expect(component.challengeArray.length).toEqual(0);

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
    let detail: HTMLElement = fixture.debugElement.query(By.css('.details')).nativeElement;
    detail.click();

    fixture.detectChanges();

    let dialog = document.body.querySelector<HTMLInputElement>('.dialog_container');
    expect(dialog).toBeTruthy();
  });


  /**
   * Tests for admin_challenges component
   * --> !! := Difficult test
   * --> ?? := Questionable if not already done by others or if it's even possible
   * 
   * - Test add-challenge button --> correct navigation happens ||
   * - Challenges are correctly displayed --> Check heading ||
   * - ?? Check detail dialog
   * - ?? Check delete dialog
   */
});
