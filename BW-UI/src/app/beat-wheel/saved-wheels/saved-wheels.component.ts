import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Wheel } from 'src/app/models/wheel.model';
import { WheelService } from 'src/app/services/wheel.service';
import { MiniWheelComponent } from "./mini-wheel/mini-wheel.component";

import { NoteTable } from 'src/app/models/noteTable';
import { Kick } from '../../audio/kick';
import { Snare } from '../../audio/snare';
import { HiHat } from '../../audio/hi-hat';
import { Synth } from '../../audio/synth';
import { X808 } from '../../audio/808';

@Component({
  selector: 'app-saved-wheels',
  imports: [CommonModule, MiniWheelComponent],
  templateUrl: './saved-wheels.component.html',
  styleUrl: './saved-wheels.component.scss'
})  
export class SavedWheelsComponent {
    wheels: Wheel[] = [];

    instrumentNames = ['Kick', '808', 'Snare', 'Hi-Hat', 'Synth']
    context: AudioContext = new AudioContext;
    loop: any;
    wheelsLoading: boolean = true;

    @Output() unauthorized = new EventEmitter();
    @Output() continue = new EventEmitter();
    @Output() selectWheel = new EventEmitter<Wheel>();

    constructor(
      private wheelService: WheelService,
      private toastr: ToastrService
    ) {
      this.wheelService.getWheels().subscribe({
        next:(wheels:any) => {
          wheels.forEach((wheel: { id: string; layersJson: string; createdAt: string; modifiedAt: string; }) => {
            this.wheels.push(new Wheel(wheel.id, wheel.layersJson, wheel.createdAt, wheel.modifiedAt))
          });
          this.wheelsLoading = false;
        },
        error:(err:any) => {
          if (err.status==401) {
            this.toastr.error('Session expired. Please log in again', 'Unauthorized');
            localStorage.clear();
            this.unauthorized.emit();
          } 
          else {
            console.log('error during get wheels:\n', err);
            this.toastr.error('There was a problem getting your wheels', 'Error');
            this.wheelsLoading = false;
          }   
        }
      });
    }

    deleteWheel(id:string) {
      this.wheelService.deleteWheel(id).subscribe({
        next:() => {
          this.toastr.success('Wheel deleted successfully');
          this.wheels = this.wheels.filter(w => w.id != id);
        },
        error:(err:any) => {
          if (err.status==401) {
            this.toastr.error('Session expired. Please log in again', 'Unauthorized');
            localStorage.removeItem('token');
            this.unauthorized.emit();
          } 
          else {
            console.log('error during login:\n', err);
            this.toastr.error('There was a problem deleting your wheel', 'Error');
          }   
        }
      });
    }

    stop() {
      this.wheels.forEach(w => {
        w.spin = false;
      })
      clearInterval(this.loop);
      this.context = new AudioContext;
    }
  
    // TODO: Repeated code - make the below functions reusable?
    async playSounds(index:number) {
      this.stop();
      this.context.resume();
      await this.sampleLoader('assets/samples/hihat.wav', this.context, (buffer: AudioBuffer) => {
        var context = this.context;
        var instrumentNames = this.instrumentNames;
        var instruments = this.wheels[index].layers;
  
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
      setTimeout(()=>this.wheels[index].spin = true, 50)
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
    // End reusables
}
