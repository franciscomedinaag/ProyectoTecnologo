import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CerradoComponent } from './cerrado.component';

describe('CerradoComponent', () => {
  let component: CerradoComponent;
  let fixture: ComponentFixture<CerradoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CerradoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CerradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
