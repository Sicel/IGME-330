let audioHolder;

// Creates a new audio element object that contains all audio properties
export function createAudioElement(audioElement, numSamples) {
    audioElement.crossOrigin = "anonymous";
    let ctx = new(window.AudioContext || window.webkitAudioContext);
    audioHolder = {
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
/*
export function toggleHS(amount, enabled) {

    if (enabled) {
        audioHolder.highShelfBiquadFilter.frequency.setValueAtTime(amount, audio.ctx.currentTime);
        audioHolder.highShelfBiquadFilter.gain.setValueAtTime(25, audio.ctx.currentTime);
    } else {
        audioHolder.highShelfBiquadFilter.gain.setValueAtTime(0, audio.ctx.currentTime);
    }
}

export function toggleLS(amount, enabled) {

    if (enabled) {
        audioHolder.lowShelfBiquadFilter.frequency.setValueAtTime(amount, audio.ctx.currentTime);
        audioHolder.lowShelfBiquadFilter.gain.setValueAtTime(15, audio.ctx.currentTime);
    } else {
        audioHolder.lowShelfBiquadFilter.gain.setValueAtTime(0, audio.ctx.currentTime);
    }
}

export function toggleDis(amount, enabled) {

    if (enabled) {
        audioHolder.distortionFilter.curve = null; // being paranoid and trying to trigger garbage collection
        audioHolder.distortionFilter.curve = makeDistortionCurve(amount);
    } else {
        audioHolder.distortionFilter.curve = null;
    }
}
*/

export function toggleHS(enabled, amount) {
    if (enabled) {
        updateHS(amount)
    } else {
        disableHS();
    }
}

export function toggleLS(enabled, amount) {
    if (enabled) {
        updateLS(amount)
    } else {
        disableLS();
    }
}

export function toggleDis(enabled, amount) {
    if (enabled) {
        updateDis(amount)
    } else {
        disableDis();
    }
}

export function updateHS(amount) {
    audioHolder.highShelfBiquadFilter.frequency.setValueAtTime(amount, audioHolder.ctx.currentTime);
    audioHolder.highShelfBiquadFilter.gain.setValueAtTime(25, audioHolder.ctx.currentTime);
}

export function disableHS() {
    audioHolder.highShelfBiquadFilter.gain.setValueAtTime(0, audioHolder.ctx.currentTime);
}

export function updateLS(amount) {
    audioHolder.lowShelfBiquadFilter.frequency.setValueAtTime(amount, audioHolder.ctx.currentTime);
    audioHolder.lowShelfBiquadFilter.gain.setValueAtTime(15, audioHolder.ctx.currentTime);
}

export function disableLS() {
    audioHolder.lowShelfBiquadFilter.gain.setValueAtTime(0, audioHolder.ctx.currentTime);
}

export function updateDis(amount) {
    audioHolder.distortionFilter.curve = null; // being paranoid and trying to trigger garbage collection
    audioHolder.distortionFilter.curve = makeDistortionCurve(amount);
}

export function disableDis() {
    audioHolder.distortionFilter.curve = null;
}

// from: https://developer.mozilla.org/en-US/docs/Web/API/WaveShaperNode
function makeDistortionCurve(amount = 20) {
    let n_samples = 256,
        curve = new Float32Array(n_samples);
    for (let i = 0; i < n_samples; ++i) {
        let x = i * 2 / n_samples - 1;
        curve[i] = (Math.PI + amount) * x / (Math.PI + amount * Math.abs(x));
    }
    return curve;
}
//------Taken from week 5 example------//
