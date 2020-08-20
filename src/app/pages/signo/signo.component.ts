import { PacienteService } from './../../_service/paciente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignoService } from './../../_service/signo.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Signo } from './../../_model/signo';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-signo',
  templateUrl: './signo.component.html',
  styleUrls: ['./signo.component.css']
})
export class SignoComponent implements OnInit {

  cantidad: number = 0;
  displayedColumns = ['idSigno', 'paciente', 'temperatura', 'pulso','ritmo','fecha','acciones'];

  dataSource: MatTableDataSource<Signo>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    private signoService: SignoService,
    private pacienteService:PacienteService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    //Solo cuando se hace next()
    this.signoService.getSignoCambio().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.signoService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
      //this.dataSource.paginator = this.paginator;
    });

    this.signoService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    })

    this.pacienteService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    })
    
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(idSigno: number) {
    this.signoService.eliminar(idSigno).subscribe(() => {
      this.signoService.listar().subscribe(data => {
        this.signoService.setSignoCambio(data);
        this.signoService.mensajeCambio.next('SE ELIMINÓ');
      });
    });
  }

  mostrarMas(e: any) {
    this.signoService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

}
