"use strict";
const ctx = document.querySelector("canvas").getContext("2d");
const canvasWidth = mycanvas.width;
const canvasHeight = mycanvas.height;
let sprites = []; // an array to hold all of our sprites
let gradient = createLinearGradient(ctx, 0, 0, 0, canvasHeight, [{
    percent: 0,
    color: "blue"
        }, {
    percent: .25,
    color: "green"
        }, {
    percent: .5,
    color: "yellow"
        }, {
    percent: .75,
    color: "red"
        }, {
    percent: 1,
    color: "magenta"
        }])


init();

function init() {
    sprites = createSprites();
    loop();
}


function loop() {
    // schedule a call to loop() in 1/60th of a second
    requestAnimationFrame(loop);

    // draw background
    ctx.save();
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // loop through sprites, move & draw!
    ctx.save();
    for (let s of sprites) {
        // move sprites
        s.move();

        // check sides and bounce
        if (s.x <= s.span / 2 || s.x >= canvasWidth - s.span / 2) {
            s.reflectX();
            s.move();
        }
        if (s.y <= s.span / 2 || s.y >= canvasHeight - s.span / 2) {
            s.reflectY();
            s.move();
        }
        // draw sprites
        s.draw(ctx);

    } // end for
    ctx.restore();


} // end loop()
