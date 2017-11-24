import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensComponent } from './mens.component';

describe('FaqComponent', () => {
  let component: MensComponent;
  let fixture: ComponentFixture<MensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [MensComponent]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
