import { Component, OnInit, EventEmitter } from '@angular/core';
import { Instrument } from '../models/instrument.model';
import { NoteTable } from 'src/app/models/noteTable';
import { Kick } from '../audio/kick';
import { Snare } from '../audio/snare';
import { HiHat } from '../audio/hi-hat';
import { Synth } from '../audio/synth';
import { X808 } from '../audio/808';

@Component({
  selector: 'app-beat-wheel',
  templateUrl: './beat-wheel.component.html',
  styleUrls: ['./beat-wheel.component.scss']
})
export class BeatWheelComponent implements OnInit {
  
  instrumentNames = ['Kick', '808', 'Snare', 'Hi-Hat', 'Synth']
  instrumentColours = [['rgb(218, 145, 218)','purple'], ['rgb(175, 175, 255)','darkblue','blue','rgb(0, 183, 255)','turquoise'], ['rgb(170, 233, 170)','green'], 
  ['rgb(255, 255, 230)', 'rgb(255, 238, 0)'], ['rgb(255, 190, 190)','darkred', 'red', 'rgb(231, 0, 108)','rgb(223, 87, 155)']]
  minMaxes = [[1,1], [2,6], [1,1], [1,1], [2,4]]
  scales = [1,2,3]
  scaleIndex: number = 0;
  instruments: Array<Instrument> = []
  activeInstrument: Instrument = new Instrument;
  bpm: number = 100;
  context: AudioContext = new AudioContext;
  modalOpen: boolean = true;
  controlModal: boolean = false;
  consent1: boolean = false;
  consent2: boolean = false;
  spin: boolean = false;
  editing: boolean = false;
  solo: boolean = false;
  mTop: number = 0;
  mLeft: number = 0;
  showAll: boolean = true;
  loop: any;

  instrumentChange = new EventEmitter<Instrument>();
  notesChanged = new EventEmitter();
  clearAll = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.scaleIndex = Math.floor(Math.random()*3);
    for (let i=0; i<this.instrumentNames.length; i++) {
      var newInstrument = new Instrument();
      newInstrument.name = this.instrumentNames[i];
      newInstrument.scaleIndex = this.scaleIndex;
      newInstrument.colours = this.instrumentColours[i];
      newInstrument.volume = Math.floor(Math.random()*4)+7;
      newInstrument.tempo = Math.floor(Math.random()*3)+1;
      newInstrument.pitch = Math.floor(Math.random()*11);
      newInstrument.fade = Math.floor(Math.random()*11);
      newInstrument.min = this.minMaxes[i][0];
      newInstrument.max = this.minMaxes[i][1];
      this.instruments.push(newInstrument);
    }
  }

  reset() {
    this.editing = false;
    this.instruments = [];
    this.ngOnInit();
    if (this.spin) {
      this.spin = false;
      clearInterval(this.loop);
      // if('webkitAudioContext' in window) {
      //   this.context = new (window as any)['webkitAudioContext']()
      // } else {
      // this.context = new window['AudioContext']();
      this.context = new AudioContext;
      // }
      this.playSounds(); 
    }   
  }

  clear() {
    this.editing = false;
    this.scaleIndex = 0;
    for (let i=0; i<this.instruments.length; i++) {
      this.instruments[i].scaleIndex = 0;
      this.instruments[i].volume = 10;
      this.instruments[i].tempo = 1;
      this.instruments[i].pitch = 5;
      this.instruments[i].fade = 5;
      this.instruments[i].notes = []; 
    }
    this.notesChanged.emit();
    this.clearAll.emit();
    if (this.spin) {
      this.spin = false;
      clearInterval(this.loop);
      this.context = new AudioContext;
    }
  }

  stop() {
    this.spin = false;
    clearInterval(this.loop);
    this.context = new AudioContext;
  }

  reposition() {
    this.showAll = false;
    setTimeout(()=>{this.showAll = true}, 0);
  }

  playSounds() {
    this.spin = true;
    // this.context = new (window['AudioContext'])();
    this.context.resume();
    setInterval(this.reposition, 7200);
    this.sampleLoader('assets/samples/hihat.wav', this.context, (buffer: AudioBuffer) => {
      var context = this.context;
      var instrumentNames = this.instrumentNames;
      var instruments = this.instruments;

      var timer = 0;
      var noteTable = new NoteTable;
      var kick = new Kick(context);
      var x808 = new X808(context);
      var snare = new Snare(context);
      var hihat = new HiHat(context, buffer);
      var synth = new Synth(context);
      var sounds = [kick, x808, snare, hihat, synth];
      
      function play() {
        timer = Math.round(timer * 10) / 10
    
        if (timer==7.2) {
          timer = 0;
        }
 
        var now = context.currentTime;

        for (let i=0; i<instrumentNames.length; i++) {
          var tempo = instruments[i].tempo;
          var currentTime = timer%(7.2/tempo)
          currentTime = Math.round(currentTime*10)/10
          var noteTimes = instruments[i].notes.map(function(x) { return Math.round(x.index*(6/tempo))/10; });

          if (noteTimes.includes(currentTime)) {
            if (!instruments[i].mute && instruments[i].volume>0) {
              var note = instruments[i].notes[noteTimes.indexOf(currentTime)]
              var volume = (instruments[i].volume)/10 * (note.volume)/10;
              var pitch = instruments[i].pitch;
              var fade = instruments[i].fade;

              if (sounds[i] == synth || sounds[i] == x808) {
                var freq = noteTable.notes[instruments[i].scaleIndex][note.noteIndex-1][1]
                sounds[i].trigger(now, volume, pitch, fade, note.length*(0.6/tempo), freq);
              } else {
                sounds[i].trigger(now, volume, pitch, fade);
              }
            }
          }
        }
        timer+=0.1;
      }
      this.loop = setInterval(play, 100);
    });
  }

  
  async sampleLoader(url: string, context: AudioContext, callback: CallableFunction) {
    fetch(url)
      .then(response => response.arrayBuffer())
      .then(data => {
        context.decodeAudioData(data, (buffer: AudioBuffer) =>  {
          callback(buffer);
        });
      })
  };

  changeScale(s: number) {
    this.scaleIndex = s-1;
    for (let i=0; i<this.instruments.length; i++) {
      this.instruments[i].scaleIndex = s-1
    }
  }

  calculatePieSize(i: Instrument) {
    var size = ((this.instruments.indexOf(i)+1)*100).toString() + 'px';
    var z = (this.instruments.length - (this.instruments.indexOf(i)+1)).toString();
    var dimensions = {'height': size, 'width': size, 'z-index': z}
    return dimensions
  }
  
  selectInstrument(i: Instrument) {
    this.activeInstrument = i;
    if (this.solo) {
      for (let j=0; j<this.instruments.length; j++) {
        if (this.instruments[j] != i) {
          this.instruments[j].mute = true;
        } else {
          this.instruments[j].mute = false;
        }
      }
    }
    this.mTop = 40 - (3.3*this.activeInstrument.pitch);
    this.mLeft = 9 + (2.1*this.activeInstrument.fade);
    this.instrumentChange.emit(i);
  }

  soloActive(i: Instrument) {
    if (!this.solo) {
      for (let j=0; j<this.instruments.length; j++) {
        if (this.instruments[j] != i) {
          this.instruments[j].mute = true;
        }
      }
      this.solo = true;
    } else {
      for (let j=0; j<this.instruments.length; j++) {
        this.instruments[j].mute = false;
      }
      this.solo = false;
    }
  }

}

