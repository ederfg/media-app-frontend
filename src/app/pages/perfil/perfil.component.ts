import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Usuario } from './../../_model/usuario';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario:Usuario = new Usuario();

  constructor(
    private dialogRef: MatDialogRef<PerfilComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Usuario,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.usuario = this.data;
  }

  cancelar() {
    this.dialogRef.close();
  }

}
