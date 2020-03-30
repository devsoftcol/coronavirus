import { Component, OnInit } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { MenuController } from '@ionic/angular';
import { MethodApiRestService } from '../services/method-api-rest.service';
import { NavController } from '@ionic/angular';
import swal from 'sweetalert2';
declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  map: any;
  directionsService: any = null;
  directionsDisplay: any = null;
  bounds: any = null;
  myLatLng: any;
  waypoints: any[];
  ubicactions = [];
  data: any = {};
  info: any[] = [];
  //ELEMENTOS


  constructor(private geolocation: Geolocation,
    private menu: MenuController,
    private _methodsApiRestService: MethodApiRestService,
    public navCtrl: NavController) { }

  ngOnInit() {
    this.getInfo();
    this.loadMap();
  }

  getInfo() {
    this._methodsApiRestService.GetMethod('get_info_nacional.php')
      .subscribe(
        response => {
          for (let obj of response['data']) {
            for (let ob of obj) {
              let datos = {
                "punto": ob[0],
                "cant": ob[1]
              }
              this.info.push(datos);
            }
          }
        },
        error => {
          if (!error.ok) {
            console.log('error');
          }
        }
      );
  }

  async loadMap() {
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      const mapEle: HTMLElement = document.getElementById('mapa');
      const map = new google.maps.Map(mapEle, {
        zoom: 14,
        center: { lat: data.coords.latitude, lng: data.coords.longitude }
      });
      localStorage.setItem('lat', data.coords.latitude.toString());
      localStorage.setItem('lng', data.coords.longitude.toString());
      var bounds = {
        17: [[20969, 20970], [50657, 50658]],
        18: [[41939, 41940], [101315, 101317]],
        19: [[83878, 83881], [202631, 202634]],
        20: [[167757, 167763], [405263, 405269]]
      };

      var imageMapType = new google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
          if (zoom < 17 || zoom > 20 ||
            bounds[zoom][0][0] > coord.x || coord.x > bounds[zoom][0][1] ||
            bounds[zoom][1][0] > coord.y || coord.y > bounds[zoom][1][1]) {
            return null;
          }

          return ['//www.gstatic.com/io2010maps/tiles/5/L2_',
            zoom, '_', coord.x, '_', coord.y, '.png'].join('');
        },
        tileSize: new google.maps.Size(256, 256)
      });

      map.overlayMapTypes.push(imageMapType);
      const heatmap = new google.maps.visualization.HeatmapLayer({
        data: this.getPoints(),
        map: map
      });
    });
  }
  getPoints() {
    this._methodsApiRestService.GetMethod('get_ubications.php')
      .subscribe(
        response => {
          if (response['code'] == 200) {
            this.ubicactions = [];
            for (let obj of response['message']['coords']) {
              this.ubicactions.push(new google.maps.LatLng(obj['lat'], obj['lng']));
            }
          } else {
            console.log('error');

          }

        },
        error => {
          if (!error.ok) {
            console.log('error');
          }
        }
      );
    return this.ubicactions;
  }


  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.toggle();
  }

  logout() {
    localStorage.setItem('name', null);
    localStorage.setItem('email', null);
    localStorage.setItem('cedula', null);
    localStorage.setItem('celular', null);
    this.navCtrl.navigateRoot('/login');
  }

  registraUbication() {
    let datos = {
      "lat": localStorage.getItem('lat'),
      "lng": localStorage.getItem('lng')
    }
    this._methodsApiRestService.PostMethod('create_ubication.php', datos)
      .subscribe(
        response => {
          if (response['code'] == 200) {
            swal.fire("Excelente!", "Ubicación registrada.. Gracias!", "success");
          } else {
            swal.fire("Ups!", "Ubicación No registrada.!", "error");
          }
        },
        error => {
          swal.fire("Ups!", "Ubicación No registrada.!", "error");
          if (!error.ok) {
          }
        }
      );
  }

}
