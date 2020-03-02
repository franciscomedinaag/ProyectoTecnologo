import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TratosComponent } from './tratos.component';

describe('TratosComponent', () => {
  let component: TratosComponent;
  let fixture: ComponentFixture<TratosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TratosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
