import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileImageEditorComponent } from './profile-image-editor.component';

describe('ProfileImageEditorComponent', () => {
  let component: ProfileImageEditorComponent;
  let fixture: ComponentFixture<ProfileImageEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileImageEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileImageEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
