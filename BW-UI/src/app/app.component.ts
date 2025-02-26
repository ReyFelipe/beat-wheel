import { Component, inject } from '@angular/core';
import { InstrumentService } from './services/instrument.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BeatWheelComponent } from './beat-wheel/beat-wheel.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [
      CommonModule,
      DragDropModule,
      FormsModule,
      BeatWheelComponent,
    ],
})
export class AppComponent {
  title = 'beat-wheel';
  instruments: any[] = [];

  instrumentService = inject(InstrumentService);

  constructor() {
    // this.instrumentService.get().subscribe(instruments => {
    //   this.instruments = instruments;
    // });
  }
}
