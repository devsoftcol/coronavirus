import { Component, OnInit } from '@angular/core';
import { MethodApiRestService } from '../services/method-api-rest.service';
import * as Bcryptjs from "bcryptjs";
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {
  //Variables del formulario
  name: string;
  address: string;
  celular: number;
  cedula: number;
  email: string;
  password: string;
  //fin variables

  constructor(private _methodsApiRestService: MethodApiRestService,
    public navCtrl: NavController) { }

  ngOnInit() {
  }

  sendRegistro() {
    var salt = Bcryptjs.genSaltSync(10);
    var hash = Bcryptjs.hashSync(this.password, salt);
    let datos = {
      "name": this.name,
      "address": this.address,
      "celular": this.celular,
      "cedula": this.cedula,
      "email": this.email,
      "password": hash
    }
    this._methodsApiRestService.PostMethod('create_user.php', datos)
      .subscribe(
        response => {
          if (response['code'] == 200) {
            localStorage.setItem('name', this.name);
            localStorage.setItem('email', this.email);
            localStorage.setItem('address', this.address);
            localStorage.setItem('cedula', this.cedula.toString());
            localStorage.setItem('celular', this.celular.toString());
            this.navCtrl.navigateRoot('/home');
          } else {

          }
        },
        error => {
          console.log(error);
          if (!error.ok) {
          }
        }
      );
  }


}
