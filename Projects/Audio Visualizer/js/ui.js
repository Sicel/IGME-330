export {
    selectedMode,
    currentColorMode,
    currentSongDuration
};
import {
    convertToTime
} from './utils.js';

let controlsShowing = false,
    downArrow = document.querySelector("#arrowContainer"),
    controls = document.querySelector("#controls"),
    playButton = document.querySelector("#play");

let mode = document.querySelector("#mode"),
    modes = ["source-atop", "destination-over", "destination-out", "lighter", "xor", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"],
    selectedMode = 'xor';

let songSelect = document.querySelector("#songSelect"),
    audioTime = document.querySelector("#audioTime"),
    currentSongTime = 0,
    currentSongDuration = 222;

let colorMode = document.querySelector("#colorMode"),
    currentColorMode = 'grad';

export function setupUI(audio, ctx) {
    downArrow.onclick = e => {
        controlsShowing = !controlsShowing;
        showControls();
    };

    audio.element.onloadedmetadata = e => {
        updateTime(0, e.target.duration)
    };

    playButton.onclick = e => {
        console.log("clicked");
        // check if context is in suspended state (autoplay policy)
        if (audio.ctx.state == "suspended") {
            audio.ctx.resume();
        }

        if (e.target.dataset.playing == "no") {
            audio.element.play();
            e.target.dataset.playing = "yes";
            e.target.innerHTML = "Pause";
            // if track is playing pause it
        } else if (e.target.dataset.playing == "yes") {
            audio.element.pause();
            e.target.dataset.playing = "no";
            e.target.innerHTML = "Play";
        }
    };

    songSelect.onchange = e => {
        audio.element.src = e.target.value;
        //audioTime.innerHTML = `0:00 / ${audio.element.duration}`;
        console.log(audio.element.currentTime);
        if (playButton.dataset.playing == "yes")
            playButton.dispatchEvent(new MouseEvent("click"));
    }

    for (let i = 0; i < modes.length; i++) {
        let option = document.createElement("option");
        option.innerHTML = modes[i];
        let attr = document.createAttribute("value");
        if (modes[i] == selectedMode)
            option.selected = true;
        attr.value = modes[i];
        option.setAttributeNode(attr);
        mode.appendChild(option);
    }

    mode.onchange = e => {
        selectedMode = e.target.value;
        ctx.globalCompositeOperation = selectedMode;
    }

    colorMode.onchange = e => currentColorMode = e.target.value;
}

function showControls() {
    if (controlsShowing) {
        downArrow.style.transform = "translate(0, -1px)";
        controls.style.transform = "translate(0, 0)";
    } else {
        downArrow.style.transform = "translate(0, -61px)";
        controls.style.transform = "translate(0, -61px)";
    }
}

export function updateTime(time, songDuration = currentSongDuration) {
    audioTime.innerHTML = `${convertToTime(time)} / ${convertToTime(songDuration)}`;
    currentSongDuration = songDuration;
}
