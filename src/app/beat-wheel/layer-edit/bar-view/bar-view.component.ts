import { Component, ElementRef, OnInit, Input, ViewChild, Output, EventEmitter, Renderer2, AfterViewInit } from '@angular/core';
import { CdkDragMove, CdkDragEnd } from '@angular/cdk/drag-drop';
import { InstrumentNote } from 'src/app/models/instrument-note.model';
import { Instrument} from 'src/app/models/instrument.model';
import { DomSanitizer } from "@angular/platform-browser";
import { not } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-bar-view',
  templateUrl: './bar-view.component.html',
  styleUrls: ['./bar-view.component.scss']
})
export class BarViewComponent implements OnInit, AfterViewInit {

  @ViewChild('notes') notesBox!: ElementRef;

  @Input() instrument = new Instrument;
  @Input() editing: boolean = false;
  @Input() loop: boolean = false;
  @Input() clearAll = new EventEmitter();
  @Output() exit = new EventEmitter();
  @Output() notesChanged = new EventEmitter();

  markers: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  spaceIndexes: Array<number> = []
  activeNote: InstrumentNote = new InstrumentNote;
  controls: boolean = false;
  noteOptions: boolean = false;
  noteColours: Array<string> = []
  box: DOMRect = new DOMRect
  dragging: boolean = false;
  canChangeSize: boolean = false;
  leftDrag: number = 0;
  rightDrag: number = 0;
  topDrag: number = 0;
  // noteTransform = '';
  showNotes: boolean = true;


  constructor(private renderer: Renderer2, public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    if (this.instrument.name=='808' || this.instrument.name=='Synth') {
      this.noteOptions = true;
      this.canChangeSize = true;
      this.noteColours = this.instrument.colours.slice(1,6);
    }
    this.calculateSpaces();
  }

  ngAfterViewInit(): void {
    this.box = this.notesBox.nativeElement.getBoundingClientRect()
    this.clearAll.subscribe(i => {
      this.calculateSpaces();
    });
  }

  calculateSpaces() {
    this.spaceIndexes = new Array;
    var index = 0;
    var noteIndexes = this.instrument.notes.map(function(x) { return x.index});
    var sortedIndexes = this.instrument.notes.map(function(x) { return x.index}).sort(function(a, b){return a - b});
    var notes = this.instrument.notes

    for (let i=0; i<sortedIndexes.length; i++) {
      while (sortedIndexes[i] != index) {
        this.spaceIndexes.push(index);
        index += 1;
      } 
      index += notes[noteIndexes.indexOf(sortedIndexes[i])].length
    }

    while (index < 12) {
      this.spaceIndexes.push(index);
      index += 1;
    }
  }

  back() {
    this.exit.emit();
  }

  clear() {
    this.instrument.notes = []
    this.controls = false;
    this.calculateSpaces();
    this.notesChanged.emit();
  }

  setActiveNote(note: InstrumentNote) {
    if (this.dragging) {
      return;
    }
    if (this.activeNote == note) {
      this.activeNote = new InstrumentNote;
      this.controls = false;
    } else {
      this.activeNote = note;
      this.controls = true;
    }
  }

  addNote(space: number) {
    var index = this.spaceIndexes.indexOf(space);
    this.spaceIndexes.splice(index, 1);
    let note = new InstrumentNote;
    note.index = space;
    note.volume = 7;
    this.instrument.notes.push(note);
    this.instrument.notes.sort((a, b) => a.index - b.index);
    this.setActiveNote(note);
    this.notesChanged.emit();
  }

  deleteNote() {
    var index = this.instrument.notes.indexOf(this.activeNote);
    this.instrument.notes.splice(index, 1);
    this.activeNote = new InstrumentNote;
    this.controls = false;
    this.calculateSpaces();
    this.notesChanged.emit();
  }

  isNote(colour: string) {
    var noteColour = this.instrument.colours[this.activeNote.noteIndex]
    if (noteColour == colour) {
      return true;
    } else {
      return false;
    }
  }

  changeNote(colour: string) {
    var newNoteIndex = this.noteColours.indexOf(colour)+1;
    this.activeNote.noteIndex = newNoteIndex;
    this.notesChanged.emit();
  }

  noteDragStart(note: InstrumentNote) {
    this.dragging = true;
    this.activeNote = note;
  }

  noteDragEnd($event: CdkDragEnd, note: InstrumentNote) {
    this.dragging = false;
    this.box = this.notesBox.nativeElement.getBoundingClientRect()
    var dist = ($event.distance.x*12)/this.box.width
    note.index += Math.round(dist);
    if (note.index<0) {
      note.index = 0;
    }
    if (note.index>(12-note.length)) {
      note.index = 12-note.length;
    }
    var notes = this.instrument.notes
    var notesCleared = false
    while (!notesCleared) {
      for (let i=0; i<notes.length; i++) {
        if (i==(notes.length-1)) {
          notesCleared = true;
        }
        if (notes[i]!=note && notes[i].index >= note.index 
          && note.index+note.length > notes[i].index) {
          notes.splice(i, 1);
          break;
        } else if (notes[i]!=note && notes[i].index < note.index 
          && notes[i].index+notes[i].length > note.index) {
          notes.splice(i, 1);
          break;
        }
      }
    }
    this.showNotes = false;
    this.activeNote = new InstrumentNote;
    setTimeout(()=> {
      this.showNotes = true;
      this.activeNote = note;
    }, 10);

    this.notesChanged.emit();
    this.calculateSpaces();
  }

  leftDragMove($event: CdkDragMove, note: InstrumentNote) {
    this.leftDrag = $event.distance.x;
  }

  leftDragEnd($event: CdkDragEnd, note: InstrumentNote) {
    this.dragging = false;
    this.leftDrag = 0;
    this.box = this.notesBox.nativeElement.getBoundingClientRect()
    var dist = ($event.distance.x*12)/this.box.width
    if (note.index+Math.round(dist) > note.index+note.length-1) {
      note.index = note.index+note.length-1
    } else {
      note.index += Math.round(dist);
    }
    note.length -= Math.round(dist);
    if (note.length<=0) {
      note.length = 1
    }
    if (note.index<0) {
      note.length += note.index;
      note.index = 0;
    }
    var notes = this.instrument.notes
    var notesCleared = false
    while (!notesCleared) {
      for (let i=0; i<notes.length; i++) {
        if (i==(notes.length-1)) {
          notesCleared = true;
        }
        if (notes[i]!=note && notes[i].index + notes[i].length > note.index
          && !(notes[i].index - note.length >= note.index)) {
          notes.splice(i, 1);
          break;
        }
      }
    }
    this.activeNote = new InstrumentNote;
    setTimeout(()=> {
      this.activeNote = note
    }, 0);

    this.notesChanged.emit();
    this.calculateSpaces();
  }

  rightDragMove($event: CdkDragMove, note: InstrumentNote) {
    this.rightDrag = $event.distance.x;
  }
 
  rightDragEnd($event: CdkDragEnd, note: InstrumentNote) {
    this.dragging = false;
    this.rightDrag = 0;
    this.box = this.notesBox.nativeElement.getBoundingClientRect()
    var dist = ($event.distance.x*12)/this.box.width
    note.length += Math.round(dist);
    if (note.length>(12-note.index)) {
      note.length = 12-note.index;
    }
    if (note.length<=0) {
      note.length = 1
    }
    var notes = this.instrument.notes
    var notesCleared = false
    while (!notesCleared) {
      for (let i=0; i<notes.length; i++) {
        if (i==(notes.length-1)) {
          notesCleared = true;
        }
        if (notes[i]!=note && notes[i].index > note.index 
          && note.index+note.length > notes[i].index) {
          notes.splice(i, 1);
          break;
        }
      }
    }
    this.activeNote = new InstrumentNote;
    setTimeout(()=> {
      this.activeNote = note
    }, 0);

    this.notesChanged.emit();
    this.calculateSpaces();
  }

  topDragMove($event: CdkDragMove, note: InstrumentNote) {
    this.topDrag = $event.distance.y;
  }

  topDragEnd($event: CdkDragEnd, note: InstrumentNote) {
    this.activeNote = new InstrumentNote;
    this.dragging = false;
    this.topDrag = 0;
    this.box = this.notesBox.nativeElement.getBoundingClientRect()
    var dist = ($event.distance.y*10)/this.box.height
    note.volume -= Math.round(dist);
    if (note.volume > 10) {
      note.volume = 10
    }
    if (note.volume < 1) {
      note.volume = 1
    }
    setTimeout(()=> {
      this.activeNote = note
    }, 0);

    this.notesChanged.emit();
  }

  
  

  

}
