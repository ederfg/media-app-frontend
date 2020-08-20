import { PacienteNuevoComponent } from './../paciente-nuevo/paciente-nuevo.component';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { PacienteService } from './../../../_service/paciente.service';
import { Paciente } from './../../../_model/paciente';
import { Observable } from 'rxjs';
import { Signo } from './../../../_model/signo';
import { SignoService } from './../../../_service/signo.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signo-edicion',
  templateUrl: './signo-edicion.component.html',
  styleUrls: ['./signo-edicion.component.css']
})
export class SignoEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;

  pacientes: Paciente[] = [];
  myControlPaciente: FormControl = new FormControl();
  pacientesFiltrados: Observable<Paciente[]>;
  pacienteSeleccionado: Paciente;

  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  

  constructor(
    private pacienteService:PacienteService,
    private route: ActivatedRoute,
    private router: Router,
    private signoService: SignoService,
    private dialog: MatDialog
    ) { }

  ngOnInit(): void {

    this.listarPacientes();
    this.pacienteService.getPacienteCambio().subscribe(data => {
      this.pacientes = data;
    });


    this.form = new FormGroup({
      'id': new FormControl(0),
      'paciente':  this.myControlPaciente,
      'temperatura': new FormControl('', [Validators.required]),
      'pulso': new FormControl('', Validators.required),
      'ritmo': new FormControl('',Validators.required),
      'fecha': new FormControl('',Validators.required)
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });

    this.pacientesFiltrados = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));

    

  }


  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  seleccionarPaciente(e: any) {
    this.pacienteSeleccionado = e.option.value;
  }


  
  mostrarPaciente(val: Paciente) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }


  filtrarPacientes(val: any) {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || el.dni.includes(val.dni)
      );
    }    
    return this.pacientes.filter(el =>
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidos.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
    );
  }



  get f() { return this.form.controls; }

  initForm() {
    //EDITAR, por lo tanto carga la data a editar
    if (this.edicion) {
      this.signoService.listarPorId(this.id).subscribe(data => {
        console.log(data);
        this.form = new FormGroup({
          'id': new FormControl(data.idSigno),
         // 'paciente': new FormControl(data.paciente),
          'paciente':  this.myControlPaciente,
          'temperatura': new FormControl(data.temperatura),
          'pulso': new FormControl(data.pulso),
          'ritmo': new FormControl(data.ritmo),
          'fecha': new FormControl(data.fecha)
        });


        this.form.controls['paciente'].setValue(data.paciente);
        
      });
     
    }
  }

  operar() {
    console.log(this.form.value);
    if (this.form.invalid) { return; }

   /* let paciente = new Paciente();
    paciente.idPaciente = this.idPacienteSeleccionado;*/
    

    let signo = new Signo();
    signo.idSigno =this.form.value['id'];

    //signo.paciente = this.form.value[''];
    
    signo.paciente = this.form.value['paciente'];;
    signo.temperatura = this.form.value['temperatura'];
    signo.pulso = this.form.value['pulso'];
    signo.ritmo = this.form.value['ritmo'];
    signo.fecha = this.form.value['fecha'];

    if (this.edicion) {
      //MODIFICAR
      this.signoService.modificar(signo).subscribe(() => {
        this.signoService.listar().subscribe(data => {
          this.signoService.signoCambio.next(data);
          this.signoService.mensajeCambio.next('SE MODIFICO');
        });
      });
    } else {
      //INSERTAR
      this.signoService.registrar(signo).subscribe(() => {
        this.signoService.listar().subscribe(data => {
          this.signoService.signoCambio.next(data);
          this.signoService.mensajeCambio.next('SE REGISTRO');
        });
      });
    }

    this.router.navigate(['signo']);
  }


  agregarPacienteNuevo() {
    const dialogRef = this.dialog.open(PacienteNuevoComponent, {
      width: '300px',
      data: this.edicion
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
     if(result.idPaciente!==undefined){
      this.pacientesFiltrados = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)));
        this.form.controls['paciente'].setValue(result);
      }
      console.log(result);
    });
  }



}
