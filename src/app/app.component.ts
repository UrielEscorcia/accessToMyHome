import { Component } from '@angular/core';
import * as io from 'socket.io-client';


interface Semaforo{
    id: string;
    status: boolean;
    response: string;
    pluma?:any;
    request?:any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

    tag: string = "";
    accesos: Semaforo[];
    socket: any;

    constructor(){
        this.accesos = [
            {
                id:"1",
                status:false,
                response:''
            },
            {
                id:"2",
                status: false,
                response:''
            }
        ]
        this.socket = io.connect('http://192.168.1.65:8888');
        this.socket.on('resAccess', this.respuestaAcceso.bind(this));
    }


    abrir(acceso:Semaforo){
        const data = {
            cluster:this.tag,
            puerta: acceso.id
        }
        this.socket.emit('getAccess', data);
    }


    respuestaAcceso(res:any){
        console.log(res);
        let acceso
        for (const puerta of this.accesos) {
            if(puerta.id == res.puerta){
                acceso = puerta
            }
        }
        if(acceso){
            clearTimeout(acceso.request);
            if (res.acceso){
                acceso.response = 'green';
                acceso.status = true;
                clearTimeout(acceso.pluma);
            }else{
                acceso.response = 'red';
            }
            acceso.pluma = setTimeout(() => {
                acceso.status = false;
            }, 3000);

            acceso.request = setTimeout(() => {
                acceso.response = '';
            }, 2000);
        }


    }


}
