import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Instrument } from 'src/app/models/instrument.model';
import { InstrumentNote } from 'src/app/models/instrument-note.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-note-edit',
    templateUrl: './note-edit.component.html',
    styleUrls: ['./note-edit.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class NoteEditComponent implements OnInit {

  @Input() instrument = new Instrument;
  @Input() note = new InstrumentNote;
  @Input() notesChanged = new EventEmitter();

  angles = [0, 30, 60, 90, 120, 150]
  segmentCSS = ''
  
  constructor() { }

  ngOnInit(): void {
    this.createPie();

    this.notesChanged.subscribe(i => {
      this.createPie();
    });
  }

  createPie() {
    this.segmentCSS = 'conic-gradient(';

    var segmentStart = 30 * this.note.index;
    var segmentEnd = segmentStart + 30 * this.note.length;

    if (this.note.index==0) {
      this.segmentCSS+=`rgb(0,0,0) 0deg, ${this.instrument.colours[this.note.noteIndex]} 1deg, ${this.instrument.colours[this.note.noteIndex]} ${segmentEnd}deg, 
      rgb(0,0,0,0) ${segmentEnd}deg, rgb(0,0,0,0) 360deg)`
    } else {
      this.segmentCSS+=`rgb(0,0,0,0) 0deg, rgb(0,0,0,0) ${segmentStart}deg, rgb(0,0,0) ${segmentStart}deg, ${this.instrument.colours[this.note.noteIndex]} ${segmentStart+1}deg, 
      ${this.instrument.colours[this.note.noteIndex]} ${segmentEnd}deg, rgb(0,0,0,0) ${segmentEnd}deg, rgb(0,0,0,0) 360deg)`
    }
  }

}
