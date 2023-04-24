import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoneComponent } from './gone.component';

describe('GoneComponent', () => {
  let component: GoneComponent;
  let fixture: ComponentFixture<GoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
