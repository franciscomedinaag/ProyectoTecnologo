import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileChooserComponent } from './file-chooser.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [FileChooserComponent],
  exports: [FileChooserComponent]
})
export class FileChooserModule { }
