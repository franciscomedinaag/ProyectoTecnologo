import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

declare var H: any;

@Component({
    selector: 'here-map',
    templateUrl: './here-map.component.html',
    styleUrls: ['./here-map.component.css']
})
export class HereMapComponent implements OnInit {

    @ViewChild("map",{read: ElementRef, static: false})
    public mapElement: ElementRef;

    @Input()
    public appId: any;

    @Input()
    public appCode: any;

    @Input()
    public lat: any;

    @Input()
    public lng: any;

    @Input()
    public width: any;

    @Input()
    public height: any;

    public constructor() { }

    public ngOnInit() { 
    }

    public ngAfterViewInit() {
        let platform = new H.service.Platform({
            "app_id": this.appId,
            "app_code": this.appCode,
            'apikey': '4l9dJTUpEj2pSQNyRNj4G9jfOWrX-0nEKIRQZ2GbcFs'
        });
        let defaultLayers = platform.createDefaultLayers();
        let map = new H.Map(
            this.mapElement.nativeElement,
            defaultLayers.vector.normal.map,
            {
                zoom: 16,
                center: { lat: this.lat, lng: this.lng }
            }
        );

        var svgMarkup = '<svg width="24" height="24" ' +
          'xmlns="http://www.w3.org/2000/svg">' +
          '<rect stroke="white" fill="#1b468d" x="1" y="1" width="105" ' +
          'height="22" /><text x="12" y="18" font-size="12pt" ' +
          'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
          'fill="white">X</text></svg>';
        
        var icon = new H.map.Icon(svgMarkup),
          coords = {lat: 20.7029869, lng: -103.3914308},
          marker = new H.map.Marker(coords, {icon: icon});

          map.addObject(marker);
          map.setCenter(coords);

          var mapEvents = new H.mapevents.MapEvents(map);

          // Add event listener:
          map.addEventListener('tap', function(evt) {
              // Log 'tap' and 'mouse' events:
              console.log(evt.type, evt.currentPointer.type); 
          });

          var behavior = new H.mapevents.Behavior(mapEvents);

          var ui = H.ui.UI.createDefault(map, defaultLayers);
    }

}
