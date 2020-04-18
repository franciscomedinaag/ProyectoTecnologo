import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobiliarioCrmComponent } from './mobiliario-crm.component';

describe('MobiliarioCrmComponent', () => {
  let component: MobiliarioCrmComponent;
  let fixture: ComponentFixture<MobiliarioCrmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobiliarioCrmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobiliarioCrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
