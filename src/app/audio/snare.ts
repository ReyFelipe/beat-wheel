export class Snare {

    context: AudioContext; 

    constructor(context: AudioContext) {
        this.context = context
    }

    noiseBuffer() {
        var bufferSize = this.context.sampleRate;
        var buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        var output = buffer.getChannelData(0);

        for (var i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        return buffer;
    }
    
    trigger(time: number, volume: number, pitch: number, fade: number) {
        // Setup 
        var noise = this.context.createBufferSource();
        noise.buffer = this.noiseBuffer();
        var noiseFilter = this.context.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 500+100*pitch;
        noise.connect(noiseFilter);

        var noiseEnvelope = this.context.createGain();
        noiseFilter.connect(noiseEnvelope);

        noiseEnvelope.connect(this.context.destination);
        var osc = this.context.createOscillator();
        osc.type = 'triangle';
        
        var oscEnvelope = this.context.createGain()
        osc.connect(oscEnvelope);
        oscEnvelope.connect(this.context.destination)

        // Trigger
        var duration = 0.15+(0.01*fade)

        noiseEnvelope.gain.setValueAtTime(volume*0.3, time);
        noiseEnvelope.gain.exponentialRampToValueAtTime(volume*0.01, time + duration);
        noise.start(time)

        osc.frequency.setValueAtTime(100, time);
        oscEnvelope.gain.setValueAtTime(volume*0.1, time);
        oscEnvelope.gain.exponentialRampToValueAtTime(volume*0.01, time + duration);
        osc.start(time)

        osc.stop(time + duration);
        noise.stop(time + duration);
    }
}
