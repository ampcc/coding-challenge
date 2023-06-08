import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminApplicationsComponent } from './admin-applications.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

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


  it('display dialog on click on detail or edit button', () => {
    let detail: HTMLElement = fixture.debugElement.query(By.css('.details')).nativeElement;
    detail.click();

    fixture.detectChanges();

    let dialog = document.body.querySelector<HTMLInputElement>('. ');
    expect(dialog).toBeTruthy();
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
   *    - Filter is displayed/hidden on click
   *    - Filter options work correctly 
   * - Dialogs are correctly displayed ||
   * 
   * Tests for active_applications:
   * - Applicatios are displayed correctly
   * - correct Buttons are displayed
   * - either time limit or submission date are displayed

   * Tests for archived_applications:
   * - Applicatios are displayed correctly
   */
});
