// https://dev.opera.com/articles/drum-sounds-webaudio/

export class Kick {

    context: AudioContext; 

    constructor(context: AudioContext) {
        this.context = context
    }
    
    trigger(time: number, volume: number, pitch: number, fade: number) {
        // Setup
        var osc = this.context.createOscillator();
        var gain = this.context.createGain();
        osc.connect(gain);
        gain.connect(this.context.destination);

        // Trigger
        osc.frequency.setValueAtTime(100+10*pitch, time);
        gain.gain.setValueAtTime(volume, time);

        var duration = 0.3+(0.03*fade)

        osc.frequency.exponentialRampToValueAtTime(0.01, time + duration);
        gain.gain.exponentialRampToValueAtTime(volume*0.0001, time + duration);

        osc.start(time);
        osc.stop(time + duration);
    }
}
