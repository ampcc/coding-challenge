import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartComponent } from './start.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Test if Start Component works properly
describe('StartComponent', () => {
  let component: StartComponent;
  let fixture: ComponentFixture<StartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        HttpClient,
        MatDialog
      ],
      imports: [
        StartComponent,
        HttpClientModule,
        MatDialogModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Check if component can be created
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
