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
} from './shapes.js';
import {
    setupUI,
    selectedMode,
    currentColorMode,
    currentSongDuration,
    updateTime
} from './ui.js'
//end

let ctx = document.querySelector("#canvas").getContext("2d"),
    numSamples = 128,
    audio = createAudioElement(document.querySelector('audio'), numSamples),
    circles = [],
    miniCircles = [],
    lines = [],
    maxDraw,
    maxMiniRadius,
    gradient,
    angleSpeed = 0.1,
    rgbGradient,
    gSet = 0;

function init() {
    setupUI(audio, ctx);
    ctx = document.querySelector("#canvas").getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    maxDraw = ctx.canvas.width >= ctx.canvas.height ? ctx.canvas.width : ctx.canvas.height;
    //mode.onchange = e => ctx.globalCompositeOperation = e.target.value;
    ctx.globalCompositeOperation = 'xor';

    setGradient();

    maxMiniRadius = maxDraw / 4;

    window.onresize = resize;
    update();
}

function update() {
    requestAnimationFrame(update);
    updateTime(audio.element.currentTime, currentSongDuration);

    audio.analyser.getByteFrequencyData(audio.data);

    //ctx.save();
    //ctx.fillStyle = '#fff';
    //ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //ctx.restore();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    var lowThirdSize = 0;
    var midThirdSize = 0;
    var highThirdSize = 0;

    var lowThirdAmount = 0;
    var midThirdAmount = 0;
    var highThirdAmount = 0;

    var lowThirdAvg = 0;
    var midThirdAvg = 0;
    var highThirdAvg = 0;

    var midLowThirdSize = 0;
    var midMidThirdSize = 0;
    var midHighThirdSize = 0;

    var midLowThirdAmount = 0;
    var midMidThirdAmount = 0;
    var midHighThirdAmount = 0;

    var midLowThirdAvg = 0;
    var midMidThirdAvg = 0;
    var midHighThirdAvg = 0;

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
                percent = highThirdAvg / 255;
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

        if (circles.length > 0) {
            let line = new Line();
            let startX = (ctx.canvas.width / 2) + circles[0].radius * Math.cos(angle2);
            let startY = (ctx.canvas.height / 2) + circles[0].radius * Math.sin(angle2);
            let endX = (ctx.canvas.width / 2) + circles[circles.length - 1].radius * Math.cos(angle2);
            let endY = (ctx.canvas.height / 2) + circles[circles.length - 1].radius * Math.sin(angle2);
            line.draw(ctx, endX, endY, startX, startY)
        }
        let third = 255;
        if (currentColorMode != 'grad')
            setRGB(255 * (lowThirdAvg / 255), 255 * (midThirdAvg / 255), 255 * (highThirdAvg / 125));
        else {
            if (gSet == 0) {
                setGradient();
                gSet++;
            }
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
    maxMiniRadius = maxDraw / 4;
    //ctx.globalCompositeOperation = mode.value
    setGradient();
    ctx.globalCompositeOperation = selectedMode;
    console.log(maxDraw);
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

function setRGB(r, g, b) {
    rgbGradient = ctx.createRadialGradient(ctx.canvas.width / 2, ctx.canvas.height / 2, 1, ctx.canvas.width / 2, ctx.canvas.height / 2, maxDraw);
    rgbGradient.addColorStop(0, 'rgb( ' + r + ' , 0, 0)');
    rgbGradient.addColorStop(.3, `rgb(0, ${g}, 0)`);
    rgbGradient.addColorStop(.5, 'rgb(0, 0, ' + b + ')');

    ctx.strokeStyle = rgbGradient;
    gSet = 0;
}
