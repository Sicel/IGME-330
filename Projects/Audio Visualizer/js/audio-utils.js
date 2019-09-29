export function createAudioElement(audioElement, numSamples) {
    let ctx = new(window.AudioContext || window.webkitAudioContext);
    let audioHolder = {
        element: audioElement,
        ctx: ctx,
        source: ctx.createMediaElementSource(audioElement),
        analyser: ctx.createAnalyser(),
        gain: ctx.createGain(),
        data: new Uint8Array(numSamples / 2)
    };

    audioHolder.analyser.fftSize = numSamples;

    audioHolder.gain.gain.value = 1;

    audioHolder.source.connect(audioHolder.gain);
    audioHolder.gain.connect(audioHolder.analyser);
    audioHolder.analyser.connect(audioHolder.ctx.destination);

    return Object.freeze(audioHolder);
}
