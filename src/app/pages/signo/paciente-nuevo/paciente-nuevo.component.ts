import { switchMap } from 'rxjs/operators';
import { Paciente } from './../../../_model/paciente';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MedicoDialogoComponent } from './../../medico/medico-dialogo/medico-dialogo.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PacienteService } from './../../../_service/paciente.service';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-paciente-nuevo',
  templateUrl: './paciente-nuevo.component.html',
  styleUrls: ['./paciente-nuevo.component.css']
})
export class PacienteNuevoComponent implements OnInit {

  form: FormGroup;

  pacienteRegistrado:Paciente = new Paciente();

  constructor(
    private dialogRef: MatDialogRef<MedicoDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: boolean,
    private pacienteService: PacienteService,

  ) {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'apellidos': new FormControl('', Validators.required),
      'dni': new FormControl(''),
      'telefono': new FormControl(''),
      'direccion': new FormControl('')
    });

  }

  get f() { return this.form.controls; }

  ngOnInit(): void {
  }

  operar() {

    if (this.form.invalid) { return; }

    let paciente = new Paciente();
    paciente.idPaciente = this.form.value['id'];
    paciente.nombres = this.form.value['nombres'];
    paciente.apellidos = this.form.value['apellidos'];
    paciente.dni = this.form.value['dni'];
    paciente.telefono = this.form.value['telefono'];
    paciente.direccion = this.form.value['direccion'];

    //INSERTAR
    this.pacienteService.returnpaciente(paciente).pipe(switchMap((responseRegistro) => {
      console.log(responseRegistro)
      this.pacienteRegistrado = responseRegistro;
      return this.pacienteService.listar();
    })).subscribe((responseListar) => {
      this.pacienteService.setPacienteCambio(responseListar);
     /* this.pacienteService.listar().subscribe(data => {
        this.pacienteService.pacienteCambio.next(data);
        this.pacienteService.mensajeCambio.next('SE REGISTRO');
        //this.pacienteRegistrado = 
        
      });*/
      this.pacienteService.setMensajeCambio("Paciente registrado y seleccionado")
      this.dialogRef.close(this.pacienteRegistrado);
    });

  }


  cancelar() {
    this.dialogRef.close();
  }

}
