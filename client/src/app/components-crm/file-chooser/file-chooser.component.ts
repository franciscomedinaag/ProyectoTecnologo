import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'template-file-chooser',
  templateUrl: './file-chooser.component.html',
  styleUrls: ['./file-chooser.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FileChooserComponent implements OnInit {
  @Input() fileType : string
  @Input() extensionFilter : string
  @Output('onChange') onChange = new EventEmitter<any>()

  private imageURL : string
  public fileData : any

  private loading : boolean = false

  constructor() { 
  }

  ngOnInit() {}

  onFileChange(event) {
    this.loading = true;
    console.log("FileType:", this.fileType)
		let reader = new FileReader();
		if(event.target.files != null && event.target.files.length > 0) {
      let file = event.target.files[0];
      
			reader.onload = (readEvent: any) => {
        var binaryString = readEvent.target.result;
        
        this.fileData = {
          "encodedFileContainer": this.fileType,
          "base64File": btoa(binaryString),
          "fileExtention": "." + file.name.split('.').pop().toLowerCase()
        }
        console.log('Got the file')
        this.loading = false;
        this.onChange.emit(this.fileData)
      };
			reader.readAsBinaryString(file);
    }
    else{
      this.loading = false;      
    }
  }

  clear() {
    this.fileData = null
  }

}
