// Creates a new audio element object that contains all audio properties
export function createAudioElement(audioElement, numSamples) {
    let ctx = new(window.AudioContext || window.webkitAudioContext);
    let audioHolder = {
        element: audioElement,
        ctx: ctx,
        source: ctx.createMediaElementSource(audioElement),
        analyser: ctx.createAnalyser(),
        gain: ctx.createGain(),
        highShelfBiquadFilter: ctx.createBiquadFilter(),
        lowShelfBiquadFilter: ctx.createBiquadFilter(),
        distortionFilter: ctx.createWaveShaper(),
        data: new Uint8Array(numSamples / 2),
    };

    audioHolder.analyser.fftSize = numSamples;

    audioHolder.highShelfBiquadFilter.type = "highshelf";
    audioHolder.lowShelfBiquadFilter.type = "lowshelf";

    audioHolder.gain.gain.value = 1;

    audioHolder.source.connect(audioHolder.highShelfBiquadFilter);
    audioHolder.highShelfBiquadFilter.connect(audioHolder.lowShelfBiquadFilter);
    audioHolder.lowShelfBiquadFilter.connect(audioHolder.distortionFilter);
    audioHolder.distortionFilter.connect(audioHolder.analyser);
    audioHolder.analyser.connect(audioHolder.gain);
    audioHolder.gain.connect(audioHolder.ctx.destination);

    return Object.freeze(audioHolder);
}
