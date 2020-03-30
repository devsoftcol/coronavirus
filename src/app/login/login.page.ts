import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import swal from 'sweetalert2';
import * as Bcryptjs from "bcryptjs";
import { MethodApiRestService } from '../services/method-api-rest.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  cedula:number;
  password:string;
  datos=null;

  constructor(public navCtrl: NavController,
    private _methodsApiRestService: MethodApiRestService) { }

  ngOnInit() {
    var id=localStorage.getItem('cedula');
    if(id!="null" && id!=null){
      this.navCtrl.navigateRoot('/home');
    }
  }


  
  login(){
    let datos={
      "cedula":this.cedula,
    }
    this._methodsApiRestService.PostMethod('get_user.php',datos)
      .subscribe(
        response => {
          if(response['code'] != 200){
            swal.fire("Ups!", "Usuario no encontrado", "error");
          }else{
            var password=response['user'][0]['us_password'];
            if(this.password!=null && this.password!=""){
              var sw=Bcryptjs.compareSync(this.password, password);
            }else{
              swal.fire("Ups!", "Contraseña vacia", "error");
            }
            if(sw) {
              localStorage.setItem('name', response['user'][0]['us_name']);
              localStorage.setItem('email', response['user'][0]['us_correo']);
              localStorage.setItem('cedula', response['user'][0]['us_cc']);
              localStorage.setItem('celular', response['user'][0]['us_cellphone']);
              this.navCtrl.navigateRoot('/home');
            }else{
              swal.fire("Ups!", "Contraseña Incorrecta", "error");
            }
          }
          
        },
          error => {
            if (!error.ok) {
              swal.fire("Ups!", "Error en Petición", "error");
            }
          }
      );
  }

}
