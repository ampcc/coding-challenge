import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChallengesComponent } from './admin-challenges.component';

describe('AdminChallengesComponent', () => {
  let component: AdminChallengesComponent;
  let fixture: ComponentFixture<AdminChallengesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminChallengesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
