export class NoteTable {
    notes: Array<any> = [];

    constructor() {
        for (let i=0; i<3; i++) {
            this.notes[i] = [];
        }
        this.notes[0].push(['F#',363.27]); 
        this.notes[0].push(['G',384.87]); 
        this.notes[0].push(['A',432]); 
        this.notes[0].push(['B',484.90]); 

        this.notes[1].push(['E',323.63]); 
        this.notes[1].push(['F#',363.27]); 
        this.notes[1].push(['G',384.87]); 
        this.notes[1].push(['B',484.90]); 

        this.notes[2].push(['C',256.87]); 
        this.notes[2].push(['D',288.33]); 
        this.notes[2].push(['Eb',305.47]); 
        this.notes[2].push(['F',342.88]); 
    }
}
