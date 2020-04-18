import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaClienteComponent } from './ficha-cliente.component';

describe('FichaClienteComponent', () => {
  let component: FichaClienteComponent;
  let fixture: ComponentFixture<FichaClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
