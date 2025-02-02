// https://blog.teamtreehouse.com/building-a-synthesizer-with-the-web-audio-api

export class Synth {

    context: AudioContext; 

    constructor(context: AudioContext) {
        this.context = context;
    }

    trigger(time: number, volume: number, pitch: number, fade: number, length?: number, freq?: number) {
        if (freq && length) {
            var gain = this.context.createGain();
            gain.connect(this.context.destination);
            gain.gain.value = volume*0.1;
        
            // var sineTerms = new Float32Array([0, 0, 1, 0, 1]);
            // var cosineTerms = new Float32Array(sineTerms.length);
            // var customWaveform = this.context.createPeriodicWave(cosineTerms, sineTerms);
            
            // Trigger
            var osc = this.context.createOscillator();
            osc.connect(gain);
            osc.type = 'sawtooth';

            if (pitch<3) {
                osc.frequency.value = freq/4;
            } else if (pitch<6) {
                osc.frequency.value = freq/2;
            } else if (pitch<9) {
                osc.frequency.value = freq;
            } else {
                osc.frequency.value = freq*2;
            } 

            if (fade==0) {
                gain.gain.setValueAtTime(volume*0.1, time+length-0.01);
            } else {
                gain.gain.setValueAtTime(volume*0.1, time+length-((length/10)*fade));
            }
            gain.gain.linearRampToValueAtTime(0.0001, time+length);

            osc.start(time);
            osc.stop(time + length)
        }
    }    
}


