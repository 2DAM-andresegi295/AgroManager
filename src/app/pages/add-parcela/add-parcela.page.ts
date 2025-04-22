import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { map } from 'rxjs';
import { MapComponent } from 'src/app/components/map/map.component';

@Component({
  selector: 'app-add-parcela',
  templateUrl: './add-parcela.page.html',
  styleUrls: ['./add-parcela.page.scss'],
  standalone:false,
})
export class AddParcelaPage implements OnInit {
  @ViewChild('mapadd') mapadd: MapComponent | undefined;

  vertices: google.maps.LatLngLiteral[]=[{lat: 0, lng: 0}];
  primero: boolean=false;
  ultimoClick: google.maps.LatLngLiteral ={lat: 0, lng: 0};

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
  }
  onMarcadorCreado(vertice: google.maps.LatLngLiteral) {
    if(this.primero){
      this.ultimoClick=vertice;
    }else{
      this.vertices[0]=vertice;
      this.primero=true;
    }
    this.cdRef.detectChanges();
  }
  agregarVertice(vertice: google.maps.LatLngLiteral) {
      this.vertices.push(vertice);
      console.log(this.vertices.length);
      this.cdRef.detectChanges();
      this.mapadd?.guardarMarcador();
      this.ultimoClick={lat: 0, lng: 0};
  }
}
