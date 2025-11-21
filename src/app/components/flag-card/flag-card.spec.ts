import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagCard } from './flag-card';

describe('FlagCard', () => {
  let component: FlagCard;
  let fixture: ComponentFixture<FlagCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlagCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlagCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
