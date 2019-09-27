export {
    createAudioElement
};

function createAudioElement(audioElement) {
    let ctx = new(window.AudioContext || window.webkitAudioContext);
    let audioHolder = {
        audio: audioElement,
        ctx: ctx,
        source: ctx.createMediaElementSource(audioElement),
        analyser: ctx.createAnalyser()
    };

    return Object.freeze(audioHolder);
}
