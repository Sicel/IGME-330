//Exports region 
export {
    init
};
//end
//Imports region
import {
    createAudioElement
} from './audio-utils.js';
import {
    Circle
} from './shapes.js'
//end

let ctx = document.querySelector("#canvas").getContext("2d"),
    canvasWidth = ctx.canvas.width,
    canvasHeight = ctx.canvas.height,
    numSamples = 128,
    playButton = document.querySelector("#play"),
    audio = createAudioElement(document.querySelector('audio'), numSamples),
    circles = [];

function init() {
    ctx = document.querySelector("#canvas").getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    playButton.onclick = e => {
        console.log("clicked");
        // check if context is in suspended state (autoplay policy)
        if (audio.ctx.state == "suspended") {
            audio.ctx.resume();
        }

        if (e.target.dataset.playing == "no") {
            audio.element.play();
            e.target.dataset.playing = "yes";
            // if track is playing pause it
        } else if (e.target.dataset.playing == "yes") {
            audio.element.pause();
            e.target.dataset.playing = "no";
        }

    };

    update();
    window.onresize = resize;
}

function update() {
    requestAnimationFrame(update);
    audio.analyser.getByteFrequencyData(audio.data);

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    let lowThirdSize = 0;
    let midThirdSize = 0;
    let highThirdSize = 0;

    let midLowThirdSize = 0;
    let midHighThirdSize = 0;

    let lowThirdAmount = 0;
    let midThirdAmount = 0;
    let highThirdAmount = 0;

    let midLowThirdAmount = 0;
    let midHighThirdAmount = 0;

    let lowThirdAvg = 0;
    let midThirdAvg = 0;
    let highThirdAvg = 0;

    let midLowThirdAvg = 0;
    let midHighThirdAvg = 0;

    for (let i = 0; i < audio.data.length; i++) {
        if (i <= audio.data.length / 3) {
            lowThirdSize++;
            lowThirdAmount += audio.data[i];
        } else if (i >= audio.data.length / 3 && i <= 2 * audio.data.length / 3) {
            midThirdSize++;
            midThirdAmount += audio.data[i];
            if (i >= audio.data.length / 3 && i <= audio.data.length / 2) {
                midLowThirdSize++;
                midLowThirdAmount += audio.data[i];
            } else {
                midHighThirdSize++;
                midHighThirdAmount += audio.data[i];
            }
        } else if (i >= 2 * audio.data.length / 3 && i < audio.data.length) {
            highThirdSize++;
            highThirdAmount += audio.data[i];
        }
    }

    lowThirdAvg = lowThirdAmount / lowThirdSize;
    midThirdAvg = midThirdAmount / midThirdSize;
    highThirdAvg = highThirdAmount / highThirdSize;

    midLowThirdAvg = midLowThirdAmount / midLowThirdSize;
    midHighThirdAvg = midHighThirdAmount / midHighThirdSize;

    //console.log("Low: " + lowThirdAvg);
    //console.log("Mid: " + midThirdAvg);
    //console.log("High: " + highThirdAvg);

    console.log("Low Mid: " + midLowThirdAvg);
    console.log("High Mid: " + midHighThirdAvg);

    if (midThirdAvg >= 50) {
        circles.push(new Circle(1));
    }

    for (let i = 0; i < circles.length; i++) {
        circles[i].draw(ctx);
        if (circles[i].radius > ctx.canvas.width) {
            circles.splice(i, 1);
        }
    }
}

function resize() {
    canvasWidth = ctx.canvas.width = window.innerWidth;
    canvasHeight = ctx.canvas.height = window.innerHeight;

}
