import {
    createAudioElement
} from './audio-utils.js';
import {
    Circle,
    Line,
    QuadCurve
} from './shapes.js';
import {
    currentSongDuration,
    updateTime
} from './ui.js';
import * as ui from './vue.js';
import {
    canvas
} from './canvas-utils.js';

let numSamples = 128,
    audio = createAudioElement(document.querySelector('audio'), numSamples),
    circles = [],
    miniCircles = [],
    maxMiniRadius, // Max radius the mini circles can be
    angleSpeed = 0.1 // Speed at which circles and lines rotate

// Initializes everything
export function init() {
    //setupUI(audio, ctx);
    canvas.init(window.innerWidth, window.innerHeight, ui.blendMode.selected);

    canvas.ctx;

    maxMiniRadius = canvas.max / 4;

    window.onresize = resize;

    update();
}

function update() {
    requestAnimationFrame(update);
    //updateTime(audio.element.currentTime, currentSongDuration);

    audio.analyser.getByteFrequencyData(audio.data);

    canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Colors the background
    if (ui.backgroundColor.enabled) {
        canvas.ctx.save();
        canvas.ctx.fillStyle = ui.backgroundColor.color;
        canvas.ctx.fillRect(0, 0, canvas.width, canvas.height);
        canvas.ctx.restore();
    }

    // Splitting the frequencies into three sections

    // Low frequencies
    var lowThirdSize = 0;
    var lowThirdAmount = 0;
    var lowThirdAvg = 0;

    // Mid frequencies
    var midThirdSize = 0;
    var midThirdAmount = 0;
    var midThirdAvg = 0;

    // High frequencies
    var highThirdSize = 0;
    var highThirdAmount = 0;
    var highThirdAvg = 0;

    /* These were meant to split the mids into threes to create more effects but I ran out of time
    var midLowThirdSize = 0;
    var midMidThirdSize = 0;
    var midHighThirdSize = 0;

    var midLowThirdAmount = 0;
    var midMidThirdAmount = 0;
    var midHighThirdAmount = 0;

    var midLowThirdAvg = 0;
    var midMidThirdAvg = 0;
    var midHighThirdAvg = 0;
    */

    // Gets the amount of frequencies in each bin and averages them
    for (let i = 0; i < audio.data.length; i++) {
        if (i <= audio.data.length / 3) {
            lowThirdSize++;
            lowThirdAmount += audio.data[i];
        } else if (i >= audio.data.length / 3 && i <= 2 * audio.data.length / 3) {
            midThirdSize++;
            midThirdAmount += audio.data[i];
            //if (i >= audio.data.length / 3 && i <= 11 * audio.data.length / 27) {
            //    midLowThirdSize++;
            //    midLowThirdAmount += audio.data[i];
            //} else if (i >= 4 * audio.data.length / 9 && i <= 14 * audio.data.length / 27) {
            //    midMidThirdSize++;
            //    midMidThirdAmount += audio.data[i];
            //} else if (i >= 5 * audio.data.length / 9 && i <= 17 * audio.data.length / 27) {
            //    midHighThirdSize++;
            //    midHighThirdAmount += audio.data[i];
            //}
        } else if (i >= 2 * audio.data.length / 3 && i < audio.data.length) {
            highThirdSize++;
            highThirdAmount += audio.data[i];
        }
    }

    lowThirdAvg = lowThirdAmount / lowThirdSize;
    midThirdAvg = midThirdAmount / midThirdSize;
    highThirdAvg = highThirdAmount / highThirdSize;

    //midLowThirdAvg = midLowThirdAmount / midLowThirdSize;
    //midMidThirdAvg = midMidThirdAmount / midMidThirdSize;
    //midHighThirdAvg = midHighThirdAmount / midHighThirdSize;

    // Creates a center circle
    if (midThirdAvg >= 45) {
        circles.push(new Circle(1));
    }

    // Creates and rotates 3 cicles and lines
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
        let angle = (i * 2 * Math.PI) / 3; // Angle of rotation for circles
        let angle2 = angle; // Angle of rotation for lines
        angle += angleSpeed;
        angleSpeed += Math.PI / 180 / 3;
        let locX = (canvas.width / 2) + maxMiniRadius * Math.cos(angle);
        let locY = (canvas.height / 2) + maxMiniRadius * Math.sin(angle);
        miniCircle.drawRotating(canvas.ctx, locX, locY, radius, 5);

        angle2 -= angleSpeed;

        // Creates lines from the smallest center circle to the largest
        if (circles.length > 0) {
            let startX = (canvas.width / 2) + circles[0].radius * Math.cos(angle2);
            let startY = (canvas.height / 2) + circles[0].radius * Math.sin(angle2);
            let endX = (canvas.width / 2) + circles[circles.length - 1].radius * Math.cos(angle2);
            let endY = (canvas.height / 2) + circles[circles.length - 1].radius * Math.sin(angle2);
            if (!ui.quadCurves.enabled) {
                let line = new Line();
                line.draw(canvas.ctx, endX, endY, startX, startY);
            } else {
                let quadCurve = new QuadCurve();
                let midX = (endX + startX) // / 2) - endX * 0.4;
                let midY = (endY + startY) // / 2) - endY * 0.4;
                quadCurve.draw(canvas.ctx, endX, endY, midX, midY, startX, startY);
            }
        }
        switch (ui.gradient.current) {
            case "rgb":
                canvas.rgbGradient(255 * (lowThirdAvg / 255), 255 * (midThirdAvg / 255), 255 * (highThirdAvg / 125));
                break;
            case "custom":
                break;
            default:
                canvas.defaultGradient();
                break;
        }
    }

    // Draws center circles
    for (let i = 0; i < circles.length; i++) {
        circles[i].draw(canvas.ctx);
        // Removes them if they are bigger than the screen
        if (circles[i].radius > canvas.max) {
            circles.splice(i, 1);
        }
    }
}

// Resets values and applies to resized window
function resize() {
    canvas.resize(window.innerWidth, window.innerHeight, ui.blendMode.selected);
    maxMiniRadius = canvas.max / 4;
}
