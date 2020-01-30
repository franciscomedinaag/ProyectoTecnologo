import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarCrmComponent } from './navbar-crm.component';

describe('NavbarCrmComponent', () => {
  let component: NavbarCrmComponent;
  let fixture: ComponentFixture<NavbarCrmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarCrmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarCrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
