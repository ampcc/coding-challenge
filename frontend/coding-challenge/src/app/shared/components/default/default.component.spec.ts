import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DefaultComponent } from './default.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

// Test if Default Component works properly
describe('DefaultComponent', () => {
  let component: DefaultComponent;
  let fixture: ComponentFixture<DefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        HttpClient,
        MatDialog
      ],
      declarations: [DefaultComponent],
      imports: [
        HttpClientModule,
        MatDialogModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Check if component can be created
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
