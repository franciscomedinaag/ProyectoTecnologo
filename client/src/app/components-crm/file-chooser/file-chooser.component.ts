import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'template-file-chooser',
  templateUrl: './file-chooser.component.html',
  styleUrls: ['./file-chooser.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FileChooserComponent implements OnInit {
  @Input() fileType : string //carpeta en storage (eso se ve en la funcion)
  @Input() extensionFilter : string
  @Output('onChange') onChange = new EventEmitter<any>()

  public imageURL : string
  public fileData : any

  public loading : boolean = false

  constructor() { 
  }

  ngOnInit() {}

  onFileChange(event) {
    console.log("filetype", this.fileType)
    this.loading = true;
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
