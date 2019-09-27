//Exports region 
export {
    init
};
//end
//Imports region
import {
    createAudioElement
} from './audio-utils';
//end

let ctx = document.querySelector("#canvas").getContext("2d"),
    canvasWidth = ctx.canvas.width,
    canvasHeight = ctx.canvas.height,
    audio = createAudioElement(document.querySelector('audio'));

function init() {
    ctx = document.querySelector("#canvas").getContext("2d");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    window.onresize(resize);
}

function resize() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
}
