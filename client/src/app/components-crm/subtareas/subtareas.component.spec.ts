import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtareasComponent } from './subtareas.component';

describe('SubtareasComponent', () => {
  let component: SubtareasComponent;
  let fixture: ComponentFixture<SubtareasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubtareasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtareasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
