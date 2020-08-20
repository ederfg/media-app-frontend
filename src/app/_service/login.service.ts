import { Usuario } from './../_model/usuario';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url: string = `${environment.HOST}/oauth/token`
  public usuario:Usuario;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(usuario: string, contrasena: string){
    const body = `grant_type=password&username=${encodeURIComponent(usuario)}&password=${encodeURIComponent(contrasena)}`;

    return this.http.post<any>(this.url, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8').set('Authorization', 'Basic ' + btoa(environment.TOKEN_AUTH_USERNAME + ':' + environment.TOKEN_AUTH_PASSWORD))
    });
  }

  estaLogueado(){
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    return token != null;
  }

  cerrarSesion(){
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    console.log(token);
   
    if(token){
      sessionStorage.clear();
      this.http.get(`${environment.HOST}/tokens/anular/${token}`).subscribe(() => {
        sessionStorage.clear();
        this.router.navigate(['login']);
      });
    }else{
      sessionStorage.clear();
      this.router.navigate(['login']);
    }    
  }

  enviarCorreo(correo: string){
    return this.http.post<number>(`${environment.HOST}/login/enviarCorreo`, correo, {
      headers: new HttpHeaders().set('Content-Type', 'text/plain')
    });
  }

  verificarTokenReset(token: string) {  
    return this.http.get<number>(`${environment.HOST}/login/restablecer/verificar/${token}`);
  }

  restablecer(token: string, clave: string) {
    return this.http.post(`${environment.HOST}/login/restablecer/${token}`, clave, {
      headers: new HttpHeaders().set('Content-Type', 'text/plain')
    });
  }

  guardarDatosToken(){
    let estaLogeado = this.estaLogueado();
    if(estaLogeado){
      let token = sessionStorage.getItem(environment.TOKEN_NAME);
      this.usuario = new Usuario();
      this.usuario.username= this.bodyDatosToken(token).user_name;
      this.usuario.roles = this.bodyDatosToken(token).authorities;
      sessionStorage.setItem('usuario', JSON.stringify(this.usuario));
      
    }
  }

  obtenerUsuarioLogeado(){
    this.usuario = JSON.parse(sessionStorage.getItem('usuario'));
    return this.usuario;
  }


  bodyDatosToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split('.')[1]));
    }
    return null;
  }

}
