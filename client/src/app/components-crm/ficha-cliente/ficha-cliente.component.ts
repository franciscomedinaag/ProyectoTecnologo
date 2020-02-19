import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ficha-cliente',
  templateUrl: './ficha-cliente.component.html',
  styleUrls: ['./ficha-cliente.component.css']
})
export class FichaClienteComponent implements OnInit {

  private id:any;

  constructor(private activated:ActivatedRoute) { }

  ngOnInit() {
    this.id=this.activated.snapshot.paramMap.get("id");
  }

}
