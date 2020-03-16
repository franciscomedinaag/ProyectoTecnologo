import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreciosFijosComponent } from './precios-fijos.component';

describe('PreciosFijosComponent', () => {
  let component: PreciosFijosComponent;
  let fixture: ComponentFixture<PreciosFijosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreciosFijosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreciosFijosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
