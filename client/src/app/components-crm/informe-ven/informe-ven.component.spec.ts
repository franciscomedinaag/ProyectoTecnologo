import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeVenComponent } from './informe-ven.component';

describe('InformeVenComponent', () => {
  let component: InformeVenComponent;
  let fixture: ComponentFixture<InformeVenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformeVenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeVenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
