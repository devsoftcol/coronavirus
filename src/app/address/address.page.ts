import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { NavController } from '@ionic/angular';
import swal from 'sweetalert2';
import { MethodApiRestService } from '../services/method-api-rest.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {
  //variables
  address:string;
  principal:string;
  item:string;
  subitem:string;
  ciudad:string;

  constructor(private _methodsApiRestService: MethodApiRestService,
    public navCtrl: NavController) { }

  ngOnInit() {
  }

  registraUbicationAddress() {
    var direccion = this.address + '%20' + this.principal + '%20%23'+ this.item+'-'+this.subitem+',%20'+this.ciudad;
    $.ajax({
      type: 'GET',
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + direccion + '&key=AIzaSyDn0qHuuVnmRP1j3lThzalCO3WuJJybv80',
      success: function (data) {
        var lat = data.results[0].geometry.location.lat;
        var lnt = data.results[0].geometry.location.lng;
        this.registraUbication(lat,lnt);
      }
    });
  }

  registraUbication(lat,lng) {
    let datos = {
      "lat": lat,
      "lng": lng
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
