import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugDBComponent } from './drug-db.component';

describe('DrugDBComponent', () => {
  let component: DrugDBComponent;
  let fixture: ComponentFixture<DrugDBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrugDBComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrugDBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
