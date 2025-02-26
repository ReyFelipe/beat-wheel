import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Instrument } from 'src/app/models/instrument.model';
import { InstrumentNote } from 'src/app/models/instrument-note.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-beat-layer',
    templateUrl: './beat-layer.component.html',
    styleUrls: ['./beat-layer.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class BeatLayerComponent implements OnInit {

  @Input() instrument = new Instrument;
  @Input() activeInstrument = new EventEmitter<Instrument>();
  @Input() notesChanged = new EventEmitter();
  @Input() spin: boolean = false;
  @Input() savedWheel: boolean = false;
  @Output() selectInstrument = new EventEmitter();

  segments: Array<number> = []
  active: boolean = false;
  spinner: boolean = false;


  constructor() { }

  ngOnInit(): void {
    for (let i=0; i<this.instrument.sections; i++) {
      this.segments.push(i);
    } 
    if (!this.savedWheel) {
      this.partition();
    }

    this.activeInstrument.subscribe(i => {
      if (i != this.instrument) {
        this.active = false;
      } else {
        this.active = true;
      }
    });

    this.notesChanged.subscribe(i => {
      this.repartition();
    });
  }

  partition() {
    var colours = "conic-gradient("
    var sectionSize = 360/this.instrument.sections;
    var section = 0;
    var colourPosition = 0
    while (section < this.instrument.sections) {
      let isNote = Math.round(Math.random());
      let remainingSections = this.instrument.sections - section;
      if (isNote && this.instrument.min <= remainingSections) {
        let note = new InstrumentNote;
        note.index = section;
        note.volume = Math.floor(Math.random()*4)+7;
        if (this.instrument.name=="808" || this.instrument.name=="Synth") {
          note.noteIndex = Math.floor(Math.random()*4)+1;
        }
        if (this.instrument.max > remainingSections) {
          note.length = remainingSections;
        } else {
          note.length = Math.floor(Math.random()*(this.instrument.max-this.instrument.min+1))+1;
        }
        if (note.index > colourPosition) {
          colours += `${this.instrument.colours[0]} ${sectionSize*colourPosition}deg, ${this.instrument.colours[0]} ${sectionSize*note.index}deg,
          ${this.instrument.colours[note.noteIndex]} ${sectionSize*note.index}deg, ${this.instrument.colours[note.noteIndex]} ${sectionSize*(note.index+note.length)}deg,`
        } else {
          colours += `${this.instrument.colours[note.noteIndex]} ${sectionSize*note.index}deg, ${this.instrument.colours[note.noteIndex]} ${sectionSize*(note.index+note.length)}deg,`
        }

        section += note.length
        colourPosition = section
        this.instrument.notes.push(note);
      } else {
        section+=1;
      }
    }
    if (colourPosition < section) {
      colours += `${this.instrument.colours[0]} ${sectionSize*colourPosition}deg, ${this.instrument.colours[0]} 360deg)`
    } else {
      colours = colours.slice(0,-1);
      colours+=")";
    }

    this.instrument.pie = colours;
    return colours
  }

  repartition() {
    var colours = "conic-gradient("
    var sectionSize = 360/this.instrument.sections;
    var section = 0;

    for (let i=0; i<this.instrument.notes.length; i++) {
      var note = this.instrument.notes[i]

      if (note.index > section) {
        colours += `${this.instrument.colours[0]} ${sectionSize*section}deg, ${this.instrument.colours[0]} ${sectionSize*note.index}deg,
        ${this.instrument.colours[note.noteIndex]} ${sectionSize*note.index}deg, ${this.instrument.colours[note.noteIndex]} ${sectionSize*(note.index+note.length)}deg,`
      } else {
        colours += `${this.instrument.colours[note.noteIndex]} ${sectionSize*note.index}deg, ${this.instrument.colours[note.noteIndex]} ${sectionSize*(note.index+note.length)}deg,`
      }
      section += note.length
    }
    if (section < 11) {
      colours += `${this.instrument.colours[0]} ${sectionSize*section}deg, ${this.instrument.colours[0]} 360deg)`
    } else {
      colours = colours.slice(0,-1);
      colours+=")";
    }
    this.instrument.pie = colours;
  }

  select() {
    this.selectInstrument.emit();
    this.active = true;
  }

}
