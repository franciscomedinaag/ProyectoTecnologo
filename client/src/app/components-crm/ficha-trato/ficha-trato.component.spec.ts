import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaTratoComponent } from './ficha-trato.component';

describe('FichaTratoComponent', () => {
  let component: FichaTratoComponent;
  let fixture: ComponentFixture<FichaTratoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaTratoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaTratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
