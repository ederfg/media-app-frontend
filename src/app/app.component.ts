import { PerfilComponent } from './pages/perfil/perfil.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from './_service/login.service';
import { MenuService } from './_service/menu.service';
import { Menu } from './_model/menu';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  menus: Menu[] = [];

  constructor(
    private menuService: MenuService,
    public loginService : LoginService,
    private dialog: MatDialog, 
  ) {}

  ngOnInit(){
    this.menuService.getMenuCambio().subscribe(data => this.menus = data);
  }


  mostrarPerfil(){
    this.dialog.open(PerfilComponent, {
      width: '350px',
      data: this.loginService.obtenerUsuarioLogeado()
    });
  }
  
}
