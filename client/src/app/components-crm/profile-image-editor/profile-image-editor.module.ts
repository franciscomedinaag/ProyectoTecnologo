import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileImageEditorComponent } from './profile-image-editor.component';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ToastrModule.forRoot()
  ],
  declarations: [ProfileImageEditorComponent],
  exports: [ProfileImageEditorComponent]
})
export class ProfileImageEditorModule { }
