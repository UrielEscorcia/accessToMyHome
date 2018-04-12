import { Component } from '@angular/core';
import * as io from 'socket.io-client';


interface Semaforo{
    id: string;
    status: boolean;
    response: string;
    pluma?:any;
    request?:any;
    tag: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

    accesos: Semaforo[];
    socket: any;

    timer: any;

    constructor(){
        this.accesos = [
            {
                id:"1",
                status:false,
                response:'',
                tag: "128-16"
            },
            {
                id:"2",
                status: false,
                response:'',
                tag: "Q1"
            }
        ]
        this.socket = io.connect('http://192.168.1.119:8888');
        this.socket.on('resAccess', this.respuestaAcceso.bind(this));
    }


    abrir(acceso:Semaforo){
        const data = {
            tag: acceso.tag,
            puerta: acceso.id
        }

        this.timer = setInterval(()=> this.socket.emit('getAccess', data) , 100)

    }

    cancelAbrir(){
        clearInterval(this.timer);
    }


    respuestaAcceso(res:any){

        const puerta = this.accesos.find(item => item.id == res.puerta)

        if(puerta){
            clearTimeout(puerta.request);
            if (res.acceso){
                puerta.response = 'green';
                puerta.status = true;
                clearTimeout(puerta.pluma);
            }else{
                puerta.response = 'red';
            }
            puerta.pluma = setTimeout(() => {
                puerta.status = false;
            }, 3000);

            puerta.request = setTimeout(() => {
                puerta.response = '';
            }, 2000);
        }


    }


}
