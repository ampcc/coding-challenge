import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoneComponent } from './gone.component';

// Test if Gone Component works properly
describe('GoneComponent', () => {
  let component: GoneComponent;
  let fixture: ComponentFixture<GoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoneComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Check if component can be created
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
