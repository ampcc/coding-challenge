import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternalErrorComponent } from './internal-error.component';

// Test if Internal Error Component works properly
describe('InternalErrorComponent', () => {
  let component: InternalErrorComponent;
  let fixture: ComponentFixture<InternalErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InternalErrorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InternalErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Check if component can be created
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
