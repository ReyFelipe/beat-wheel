// https://dev.opera.com/articles/drum-sounds-webaudio/

export class HiHat {

    context: AudioContext; 
    buffer: AudioBuffer;

    constructor(context: AudioContext, buffer: AudioBuffer) {
        this.context = context;
        this.buffer = buffer;
    }
    
    trigger(time: number, volume: number, pitch: number, fade: number) {
        // Setup
        var source = this.context.createBufferSource();
        source.buffer = this.buffer;
        source.playbackRate.value = 0.75+0.05*pitch;

        var sampleEnvelope = this.context.createGain()
        source.connect(sampleEnvelope);
        sampleEnvelope.connect(this.context.destination)
         
        // Trigger
        sampleEnvelope.gain.setValueAtTime(volume, time);
        sampleEnvelope.gain.linearRampToValueAtTime(volume*0.001, time+0.28-0.025*fade);
        source.start(time);
    }    
}


