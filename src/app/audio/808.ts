export class X808 {

    context: AudioContext; 

    constructor(context: AudioContext) {
        this.context = context
    }
    
    trigger(time: number, volume: number, pitch: number, fade: number, length?: number, freq?: number ) {
        if (freq && length) {
            // Setup
            var osc = this.context.createOscillator();
            var osc2 = this.context.createOscillator();
            var gain = this.context.createGain();
            var gain2 = this.context.createGain();
            osc.connect(gain);
            osc2.connect(gain2);    
            gain.connect(this.context.destination);
            gain2.connect(this.context.destination);

            // Trigger
            osc.frequency.setValueAtTime(150, time);

            osc2.frequency.setValueAtTime(freq*0.125, time);

            gain.gain.setValueAtTime(volume, time);

            gain2.gain.value = volume;

            if (fade==0) {
                gain2.gain.setValueAtTime(volume, time + length - 0.01);
            } else {
                gain2.gain.setValueAtTime(volume, time + length - (length/10*fade));
            }

            osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
            gain.gain.exponentialRampToValueAtTime(volume*0.0001, time + 0.5);
            gain2.gain.linearRampToValueAtTime(volume*0.0001, time + length);


            osc.start(time);
            osc2.start(time);
            osc.stop(time + 0.5);
            osc2.stop(time + length)
        }

    }
}
