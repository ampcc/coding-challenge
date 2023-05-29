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
   * 
   */
});
