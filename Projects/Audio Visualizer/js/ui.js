export {
    selectedMode,
    currentColorMode,
    currentSongDuration,
    backgroundColor,
    includeBackground
};
import {
    convertToTime
} from './utils.js';

let controlsShowing = false,
    controlHeaders = document.querySelectorAll(".controlHeading"),
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
    colorPicker = document.querySelector("#colorPicker"),
    includeBackground = document.querySelector('#includeBackground'),
    currentColorMode = 'grad',
    backgroundColor = '#113',
    colorPickerClicked = false;

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

    for (let i = 0; i < controlHeaders.length; i++) {
        controlHeaders[i].onclick = _ => {
            console.log(controlHeaders[i]);
            showSection(controlHeaders[i]);
        };
    }

    songSelect.onchange = e => {
        audio.element.src = e.target.value;
        //audioTime.innerHTML = `0:00 / ${audio.element.duration}`;
        console.log(audio.element.currentTime);
        if (playButton.dataset.playing == "yes")
            playButton.dispatchEvent(new MouseEvent("click"));
    };

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
    };

    colorMode.onchange = e => currentColorMode = e.target.value;

    colorPicker.onclick = e => {
        if (!colorPickerClicked) {
            e.target.jscolor.onFineChange = function () {
                updateColor(e.target.jscolor);
            };
            colorPickerClicked = true;
        }
    }

    includeBackground.onclick = e => {
        colorPicker.style.display;

    }

    function showControls() {
        if (controlsShowing) {
            downArrow.style.transform = "translate(0, -1px)";
            controls.style.transform = `translate(0, 0)`;
        } else {
            downArrow.style.transform = `translate(0, ${-controls.offsetHeight - 1}px)`;
            controls.style.transform = `translate(0, ${-controls.offsetHeight}px)`;
        }
    }

    function showSection(header) {
        let arrow = header.firstElementChild;
        let content = header.nextElementSibling;

        if (header.dataset.showing == "false") {
            content.style.animationPlayState = "resume";
            content.style.display = "block";
            content.style.visibility = "visible";
            arrow.style.transform = "rotate(45deg)";
            header.dataset.showing = "true";
        } else {
            content.style.animationPlayState = "pause";
            content.style.display = "none";
            content.style.visibility = "hidden";
            arrow.style.transform = "rotate(-45deg)";
            header.dataset.showing = "false";
        }
    }

    export function updateTime(time, songDuration = currentSongDuration) {
        audioTime.innerHTML = `${convertToTime(time)} / ${convertToTime(songDuration)}`;
        currentSongDuration = songDuration;
    }

    function updateColor(jscolor) {
        backgroundColor = `#${jscolor}`;
    }
