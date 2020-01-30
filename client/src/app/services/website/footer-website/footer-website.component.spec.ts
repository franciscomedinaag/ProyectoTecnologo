import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterWebsiteComponent } from './footer-website.component';

describe('FooterWebsiteComponent', () => {
  let component: FooterWebsiteComponent;
  let fixture: ComponentFixture<FooterWebsiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterWebsiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
