import { InstrumentNote } from "./instrument-note.model";

export class Instrument {
    name: string = '';
    sections: number = 12;
    scaleIndex: number = 0; 
    notes: Array<InstrumentNote> = [];
    pie: string = ''
    min: number = 1;
    max: number = 12;
    volume: number = 10;
    pitch: number = 5;
    fade: number = 5;
    colours: Array<string> = [];
    tempo: number = 1;
    mute: boolean = false;
}




