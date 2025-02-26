import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BeatLayerComponent } from '../../beat-layer/beat-layer.component';
import { Instrument } from 'src/app/models/instrument.model';

@Component({
  selector: 'app-mini-wheel',
  imports: [
      CommonModule,
      BeatLayerComponent,
  ],
  templateUrl: './mini-wheel.component.html',
  styleUrl: './mini-wheel.component.scss'
})
export class MiniWheelComponent {
    @Input() layers: Instrument[]  = [];
    @Input() spin: boolean = false;

    constructor() { }

    calculatePieSize(i: Instrument) {
      // var multiplier = window.innerWidth > 500 ? 100 : 100 - Math.ceil((500 - window.innerWidth) / 50)*10;
      var multiplier = 30;
      var size = ((this.layers.indexOf(i)+1)*multiplier).toString() + 'px';
      var z = (this.layers.length - (this.layers.indexOf(i)+1)).toString();
      var dimensions = {'height': size, 'width': size, 'z-index': z}
      return dimensions
    }
}
