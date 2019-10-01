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
    Circle,
    Line
} from './shapes.js'
//end

let ctx = document.querySelector("#canvas").getContext("2d"),
    numSamples = 128,
    playButton = document.querySelector("#play"),
    //mode = document.querySelector("#mode"),
    audio = createAudioElement(document.querySelector('audio'), numSamples),
    circles = [],
    miniCircles = [],
    lines = [],
    maxDraw,
    maxMiniRadius,
    gradient,
    angleSpeed = 0.1,
    modes = ["source-atop", "destination-over", "destination-out", "lighter", "xor", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];

function init() {

    //for (let i = 0; i < modes.length; i++) {
    //    let option = document.createElement("option");
    //    option.innerHTML = modes[i];
    //    let attr = document.createAttribute("value");
    //    attr.value = modes[i];
    //    option.setAttributeNode(attr);
    //    mode.appendChild(option);
    //}

    ctx = document.querySelector("#canvas").getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    maxDraw = ctx.canvas.width >= ctx.canvas.height ? ctx.canvas.width : ctx.canvas.height;
    //mode.onchange = e => ctx.globalCompositeOperation = e.target.value;
    ctx.globalCompositeOperation ="xor";

    setGradient();

    maxMiniRadius = maxDraw / 3;
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

    let lowThirdAmount = 0;
    let midThirdAmount = 0;
    let highThirdAmount = 0;

    let lowThirdAvg = 0;
    let midThirdAvg = 0;
    let highThirdAvg = 0;

    let midLowThirdSize = 0;
    let midMidThirdSize = 0;
    let midHighThirdSize = 0;

    let midLowThirdAmount = 0;
    let midMidThirdAmount = 0;
    let midHighThirdAmount = 0;

    let midLowThirdAvg = 0;
    let midMidThirdAvg = 0;
    let midHighThirdAvg = 0;

    for (let i = 0; i < audio.data.length; i++) {
        if (i <= audio.data.length / 3) {
            lowThirdSize++;
            lowThirdAmount += audio.data[i];
        } else if (i >= audio.data.length / 3 && i <= 2 * audio.data.length / 3) {
            midThirdSize++;
            midThirdAmount += audio.data[i];
            if (i >= audio.data.length / 3 && i <= 11 * audio.data.length / 27) {
                midLowThirdSize++;
                midLowThirdAmount += audio.data[i];
            } else if (i >= 4 * audio.data.length / 9 && i <= 14 * audio.data.length / 27) {
                midMidThirdSize++;
                midMidThirdAmount += audio.data[i];
            } else if (i >= 5 * audio.data.length / 9 && i <= 17 * audio.data.length / 27) {
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
    midMidThirdAvg = midMidThirdAmount / midMidThirdSize;
    midHighThirdAvg = midHighThirdAmount / midHighThirdSize;

    //console.log("Low: " + lowThirdAvg);
    //console.log("Mid: " + midThirdAvg);
    //console.log("High: " + highThirdAvg);

    //console.log("Low Mid: " + midLowThirdAvg);
    //console.log("Mid Mid: " + midMidThirdAvg);
    //console.log("High Mid: " + midHighThirdAvg);

    if (midThirdAvg >= 45) {
        circles.push(new Circle(1));
        lines.push(new Line());
    }

    for (let i = 0; i < 3; i++) {
        let miniCircle = new Circle(1, 0.1);
        let percent = 0;
        let radius = 0;
        switch (i) {
            case 0:
                percent = lowThirdAvg / 255;
                radius = maxMiniRadius * percent;
                break;
            case 1:
                percent = midThirdAvg / 255;
                radius = maxMiniRadius * percent;
                //miniCircle.drawRotating(ctx, ctx.canvas.width / 4, ctx.canvas.height / 2, radius, 5);
                break;
            case 2:
                percent = highThirdAvg / 20;
                radius = maxMiniRadius * percent;
                //miniCircle.drawRotating(ctx, 3 * ctx.canvas.width / 4, ctx.canvas.height / 2, radius, 5);
                break;
        }
        let angle = (i * 2 * Math.PI) / 3;
        let angle2 = angle;
        angle += angleSpeed;
        angleSpeed += Math.PI / 180 / 3;
        let locX = (ctx.canvas.width / 2) + maxMiniRadius * Math.cos(angle);
        let locY = (ctx.canvas.height / 2) + maxMiniRadius * Math.sin(angle);
        miniCircle.drawRotating(ctx, locX, locY, radius, 5);

        angle2 -= angleSpeed;
        //for (let j = 0; j < circles.length; j++) {
        //        let startX = (ctx.canvas.width / 2) + circles[i].radius * Math.cos(angle2);
        //        let startY = (ctx.canvas.height / 2) + circles[i].radius * Math.sin(angle2);
        //        let endX = (ctx.canvas.height / 2) + maxDraw * Math.cos(angle2);
        //        let endY = (ctx.canvas.height / 2) + maxDraw * Math.sin(angle2);
        //        lines[i].draw(ctx, startX, startY, endX, endY);
        //    }
        
        if (circles.length > 0) {
            let line = new Line();
            let endX = (ctx.canvas.height / 2) + circles[i].radius * Math.cos(angle2);
            let endY = (ctx.canvas.height / 2) + circles[i].radius * Math.sin(angle2);
            line.draw(ctx, ctx.canvas.width / 2, ctx.canvas.height / 2, endX, endY)
        }
    }

    for (let i = 0; i < circles.length; i++) {
        circles[i].draw(ctx);
        if (circles[i].radius > maxDraw) {
            circles.splice(i, 1);
            lines.splice(i, 1);
        }
    }
}

function rotateCanvas(ctx) {
    ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.rotate(Math.PI / 180);
    ctx.translate(-ctx.canvas.width / 2, -ctx.canvas.height / 2);
}

function resize() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    maxDraw = ctx.canvas.width >= ctx.canvas.height ? ctx.canvas.width : ctx.canvas.height;
    //ctx.globalCompositeOperation = mode.value
    setGradient();
}

function setGradient() {
    gradient = ctx.createRadialGradient(ctx.canvas.width / 2, ctx.canvas.height / 2, 1, ctx.canvas.width / 2, ctx.canvas.height / 2, maxDraw);
    gradient.addColorStop(0, '#fff');
    gradient.addColorStop(1 / 6, '#0088FF');
    gradient.addColorStop(1 / 3, '#FFAA00');
    gradient.addColorStop(1 / 2, '#FF7700');
    gradient.addColorStop(2 / 3, '#FF0033');
    gradient.addColorStop(5 / 6, '#9911AA');
    gradient.addColorStop(1, '#AADD22');

    ctx.strokeStyle = gradient;
}
